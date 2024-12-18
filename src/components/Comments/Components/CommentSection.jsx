import React, { useState, useEffect } from "react";
import { Loader, Message, Header, Button } from "semantic-ui-react";
import CommentComponent from "./CommentComponent";
import AddComment from "./AddComment";
import moment from "moment";
import "../StyleSheets/CSS/CommentApp.css";
import { fetchCommentByPostId } from "../Services/api";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(7);

  const username = JSON.parse(localStorage.getItem("user")).username;

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchCommentByPostId(postId);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = response.data.map((comment) => ({
        ...comment,
        formattedTime: moment(comment.createdAt).format("DD MMM YYYY, hh:mm A"), // Pre-format time
      }));

      setComments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleCommentPosted = () => {
    fetchComments();
  };

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 7);
  };

  const handleGoBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <Header as="h2" className="custom-header-h1" dividing>
        Discussion
      </Header>

      {loading && <Loader active inline="centered">Loading comments...</Loader>}

      {error && <Message error content={`Failed to load comments: ${error}`} />}

      {!loading && !error && comments.length === 0 && (
        <Message info content="No comments available for this post." />
      )}

      {!loading && !error && (
        <AddComment
          postId={postId}
          onCommentPosted={handleCommentPosted}
          userId={username}
        />
      )}

      {!loading && !error && comments.length > 0 && (
        <>
          <Header className="custom-header-h1" as="h3" dividing>
            Previous Discussions
          </Header>
          {comments.slice(0, visibleCount).map((comment) => (
            <CommentComponent
              key={comment.id}
              id={comment.id}
              postId={postId}
              author={comment.userId}
              createdtime={comment.formattedTime}
              text={comment.content}
              replies={comment.replies}
            />
          ))}

          {visibleCount < comments.length && (
            <Button
              className="custom-primary-button"
              onClick={handleLoadMore}
            >
              Load More
            </Button>
          )}

          {visibleCount > 10 && (
            <Button
              className="custom-secondary-button"
              onClick={handleGoBackToTop}
            >
              Go Back to Top
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default CommentSection;
