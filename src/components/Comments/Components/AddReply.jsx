import React, { useState, useRef } from "react";
import { Form, TextArea, Button } from "semantic-ui-react";
import { addReply } from "../Services/api";

const AddReply = ({ postId, userId, commentId, onReplyPosted }) => {
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    setReplyText(e.target.value);
  };

  const handlePost = async () => {
    if (!replyText.trim()) {
      setError("Comment cannot be blank");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await addReply(commentId, {
        content: replyText,
        userId: userId,
      });

      if (response.status === 200 || response.status === 201) {
        setReplyText("");
        // Notify parent to refresh comments
        if (onReplyPosted) {
          onReplyPosted();
        }
      }
    } catch (err) {
      setError(err.message || "An error occurred while posting the reply.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    setReplyText(""); // Clear the text area
  };

  return (
    <Form className="custom-form">
      <Form.Field>
        <TextArea
          className="custom-comment-textarea"
          ref={textareaRef}
          value={replyText}
          onChange={handleChange}
          placeholder={`Write a reply to ${userId}...`}
        />
      </Form.Field>
      <div>
        <Button
          onClick={handlePost}
          className="custom-primary-button"
          loading={loading}
        >
          Post
        </Button>
        <Button onClick={handleDelete} className="custom-secondary-button">
          Clear
        </Button>
      </div>
      {error && <div className="custom-error-message">{error}</div>}
    </Form>
  );
};

export default AddReply;
