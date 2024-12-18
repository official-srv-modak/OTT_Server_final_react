import React, { useState, useRef, useEffect } from "react"; 
import {
  TextArea,
  Comment,
  CommentGroup,
  CommentContent,
  CommentAvatar,
  CommentMetadata,
  CommentActions,
  CommentAction,
  CommentAuthor,
  Button,
  Form,
} from "semantic-ui-react";
import moment from "moment";
import { fetchRepliesByCommentId, addReply } from "../Services/api";

const ReplyComponent = ({ id, userId, postId, createdtime, content, commentId, onReplyPosted }) => {
  const [isReplyVisible, setIsReplyVisible] = useState(false);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  const toggleReplyVisibility = () => {
    setIsReplyVisible(!isReplyVisible);
  };

  const handleChange = (e) => {
    setReplyText(e.target.value);
  };

  const fetchReplies = async () => {
    try {
      const response = await fetchRepliesByCommentId(commentId);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Error: ${response.statusText}`);
      }

      let data = response.data;
      setReplies(data);
      
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchReplies();
  }, [commentId]);

  const handlePost = async () => {
    if (!replyText.trim()) {
      setError("Reply cannot be blank.");
      return;
    }

    try {
      const response = await addReply(commentId, { content: replyText, userId });

      if (response.status === 200 || response.status === 201) {
        setReplyText(""); // Clear the input
        fetchReplies(); // Refresh replies
        if (onReplyPosted) {
          onReplyPosted();
        }
      }
    } catch (err) {
      setError("Failed to post reply.");
    }
  };

  const handleClear = () => {
    setReplyText("");
  };

  return (
    <CommentGroup className="custom-replies">
      <Comment className=".custom-reply">
        <CommentContent className="custom-reply-content">
        <div className="custom-author-metadata-container">
        <CommentAvatar src="https://react.semantic-ui.com/images/avatar/small/jenny.jpg"  />
            <CommentAuthor as="a" className="custom-reply-author">{userId}</CommentAuthor>
            <CommentMetadata className="custom-comment-metadata">
              <div>{moment(createdtime).format("DD/MM/YYYY, hh:mm A")}</div>
            </CommentMetadata>
        </div>
          <Comment.Text className="custom-comment-textarea">{content}</Comment.Text>
          <CommentActions className="custom-comment-actions">
            <Button
              className="custom-primary-button"
              onClick={toggleReplyVisibility}
            >
              {isReplyVisible ? "Cancel" : "Reply"}
            </Button>
          </CommentActions>

          {isReplyVisible && (
            <Form className="custom-form">
              <Form.Field>
                <TextArea
                  ref={textareaRef}
                  value={replyText}
                  onChange={handleChange}
                  placeholder={`Write a reply to ${userId}...`}
                  className="custom-comment-textarea"
                />
              </Form.Field>
              <Button onClick={handlePost} className="custom-primary-button">
                Post
              </Button>
              <Button onClick={handleClear} className="custom-secondary-button">
                Clear
              </Button>
            </Form>
          )}
        </CommentContent>
      </Comment>
    </CommentGroup>
  );
};

export default ReplyComponent;
