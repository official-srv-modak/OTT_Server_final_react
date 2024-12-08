import React from 'react';
import CommentSection from './Components/CommentSection.jsx';
import { Container } from 'semantic-ui-react';
import './StyleSheets/CSS/CommentApp.css';
import { ReplyProvider } from './Context/ReplyContext.jsx'; // Import the ReplyProvider

class CommentApp extends React.Component {
  render() {
    const postId = '121'; // Replace with dynamic postId as needed

    return (
      <ReplyProvider>
        <Container className="custom-comment-app">

          <div className="custom-comment-main">
            <CommentSection postId={postId} />
          </div>
        </Container>
      </ReplyProvider>
    );
  }
}

export default CommentApp;
