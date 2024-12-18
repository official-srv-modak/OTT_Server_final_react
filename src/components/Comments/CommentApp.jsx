import React from 'react';
import CommentSection from './Components/CommentSection.jsx';
import { Container } from 'semantic-ui-react';
import './StyleSheets/CSS/CommentApp.css';
import { ReplyProvider } from './Context/ReplyContext.jsx'; // Import the ReplyProvider

const CommentApp = ({ postId }) => {
  return (
    <ReplyProvider>
      <Container className="custom-comment-app">
        <div className="custom-comment-main">
          {/* Pass the postId dynamically to CommentSection */}
          <CommentSection postId={postId} />
        </div>
      </Container>
    </ReplyProvider>
  );
};

export default CommentApp;
