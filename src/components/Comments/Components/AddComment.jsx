import React, { useState } from "react";
import { CommentGroup, Form, Button, TextArea } from "semantic-ui-react";
import { addComment } from "../Services/api";

const AddComment = ({ postId, onCommentPosted, userId = "Anurav" }) => {
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleDelete = () => {
    setCommentText(""); // Clears the TextArea
  };

  const handleChange = (e) => {
    setCommentText(e.target.value); // Updates the state with the new comment text
  };

  const handlePostComment = async () => {
    if (!commentText.trim()) {
      setError("Comment cannot be empty!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await addComment({
        content: commentText,
        postId: postId,
        userId: userId,
      });

      if (response.status === 200 || response.status === 201) {
        setCommentText("");
        setSuccessMessage("Comment posted successfully!");
        if (onCommentPosted) onCommentPosted();
      } else {
        throw new Error("Failed to post comment!");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="custom-comment-container">
      <Form reply>
        <TextArea
          className="custom-comment-textarea"
          placeholder="Add a new comment..."
          value={commentText}
          onChange={handleChange}
        />
        <div className="custom-comment-buttons">
          <Button
            className="custom-primary-button"
            onClick={handlePostComment}
            loading={loading}
            disabled={loading}
          >
            Post Comment
          </Button>
          <Button
            className="custom-secondary-button"
            onClick={handleDelete}
          >
            Clear
          </Button>
        </div>
      </Form>
      {error && <div className="custom-error-message">{error}</div>}
      {successMessage && (
        <div className="custom-success-message">{successMessage}</div>
      )}
    </div>
  );
};

export default AddComment;
