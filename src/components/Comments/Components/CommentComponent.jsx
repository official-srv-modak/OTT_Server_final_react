import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Comment,
  CommentGroup,
  CommentContent,
  CommentAvatar,
  CommentActions,
  Button,
  CommentAuthor,
  CommentMetadata,
  CommentText,
} from "semantic-ui-react";
import ReplyComponent from "./ReplyComponent";
import AddReply from "./AddReply";
import { fetchRepliesByCommentId } from "../Services/api";

const CommentComponent = ({ id, postId, author, createdtime, text }) => {
  const [isReplyVisible, setIsReplyVisible] = useState(false);
  const [replies, setReplies] = useState([]);
  const [displayedReplies, setDisplayedReplies] = useState(5); // Initially show 5 replies
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleReplyVisibility = () => {
    setIsReplyVisible(!isReplyVisible);
  };

  const fetchReplies = async () => {
    try {
      setLoading(true);
      const response = await fetchRepliesByCommentId(id);
      if (response.status === 200 || response.status === 201) {
        setReplies(response.data);
      }
    } catch (err) {
      setError("Failed to load replies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReplies();
  }, [id]);

  const handleReplyPosted = () => {
    fetchReplies(); // Refresh replies dynamically after a new one is posted
  };

  const handleShowMore = () => {
    setDisplayedReplies((prev) => Math.min(prev + 4, replies.length)); // Show 4 more replies
  };

  const handleShowLess = () => {
    setDisplayedReplies((prev) => Math.max(prev - 4, 5)); // Show 4 fewer replies, minimum 5
  };

  const handleShowAll = () => {
    setDisplayedReplies(replies.length); // Show all replies
  };

  const avatarUrls = [
    "https://robohash.org/1?set=set5&size=50x50",
    "https://robohash.org/2?set=set5&size=50x50",
    "https://robohash.org/3?set=set5&size=50x50",
    "https://robohash.org/4?set=set5&size=50x50",
    "https://robohash.org/5?set=set5&size=50x50",
    "https://robohash.org/6?set=set5&size=50x50",
    "https://robohash.org/7?set=set5&size=50x50",
    "https://robohash.org/8?set=set5&size=50x50",
    "https://robohash.org/9?set=set5&size=50x50",
    "https://robohash.org/10?set=set5&size=50x50",
    "https://robohash.org/11?set=set5&size=50x50",
    "https://robohash.org/12?set=set5&size=50x50",
    "https://robohash.org/13?set=set5&size=50x50",
    "https://robohash.org/14?set=set5&size=50x50",
    "https://robohash.org/15?set=set5&size=50x50"
];


  // Function to select a random avatar
  const getRandomAvatar = () => {
    return avatarUrls[Math.floor(Math.random() * avatarUrls.length)];
  };

  return (
    <CommentGroup className="custom-commentgroup">
      <Comment className="custom-comment">
      <div className="custom-author-metadata-container">
        
        <CommentContent className="custom-comment-content">
        <div className="custom-comment-header">
        <CommentAvatar
          src={getRandomAvatar()}
        />
          <CommentAuthor as="a" className="custom-comment-author">
            {author}
          </CommentAuthor>
          <CommentMetadata className="custom-comment-metadata">
            <div>{createdtime}</div>
          </CommentMetadata>
        </div>
          <CommentText className="custom-comment-textarea">
            <p>{text}</p>
          </CommentText>
          <CommentActions className="custom-comment-actions">
            <Button
              className="custom-primary-button"
              size="tiny"
              onClick={toggleReplyVisibility}
            >
              {isReplyVisible ? "Cancel" : "Reply"}
            </Button>
          </CommentActions>
        </CommentContent>
        </div>

        {/* Conditionally render AddReply */}
        {isReplyVisible && (
          <AddReply
            userId={author}
            postId={postId}
            commentId={id}
            onReplyPosted={handleReplyPosted}
          />
        )}

        {/* Render replies with pagination */}
        {replies.slice(0, displayedReplies).map((reply) => (
          <ReplyComponent
            key={reply._id}
            id={reply._id}
            userId={reply.userId}
            postId={postId}
            createdtime={moment(reply.createdAt).format("DD/MM/YYYY, hh:mm A")}
            content={reply.content}
            commentId={id}
            onReplyPosted={handleReplyPosted}
          />
        ))}

</Comment>
        
        {/* Buttons for Show More, Show Less, Show All */}
        {replies.length > 5 && (
          <div className="custom-reply-pagination">
            {displayedReplies < replies.length && (
              <Button
                className="custom-secondary-button"
                size="small"
                onClick={handleShowMore}
              >
                Show More
              </Button>
            )}
            {displayedReplies > 5 && (
              <Button
                className="custom-reply-pagination"
                size="small"
                onClick={handleShowLess}
              >
                Show Less
              </Button>
            )}
            {displayedReplies !== replies.length && (
              <Button
                className="custom-secondary-button"
                size="small"
                onClick={handleShowAll}
              >
                Show All
              </Button>
            )}
          </div>
        )}
        
      
    </CommentGroup>

    
  );
};

export default CommentComponent;
