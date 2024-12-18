import React from "react";
import { CommentActions, Button } from "semantic-ui-react";

const AddAction = ({ isReplyVisible, toggleReplyVisibility }) => {
  return (
    <CommentActions className="custom-comment-actions">
      {/* Convert to Button and toggle reply visibility */}
      <Button
        className="custom-reply-toggle-button"
        size="tiny"
        onClick={toggleReplyVisibility}
      >
        {isReplyVisible ? "Cancel" : "Reply"}
      </Button>
    </CommentActions>
  );
};

export default AddAction;
