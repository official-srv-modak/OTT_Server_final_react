import axios from 'axios';

const api=axios.create({
    baseURL: 'http://localhost:8080/api',
});

export const fetchComments=()=>api.get('/comments/admin/all');
export const fetchCommentById=(id)=>api.get(`/comments/${id}`);
export const fetchCommentByUserId= (userId) => api.get(`/comments/user/${userId}`);
export const fetchCommentByPostId= (postId) => api.get(`/comments/post/${postId}`);
export const fetchRepliesByCommentId= (commentId) => api.get(`/comments/${commentId}/replies`);
export const addComment=(comment)=> api.post('/comments',comment);
export const updateComment =(id, updatedComment) => api.put(`/comments/${id}`,updatedComment);
export const deleteComment =(id) => api.delete(`/comments/${id}`);
export const addReply= (commentId,reply) => api.post(`/comments/${commentId}/reply`,reply);
export const updateReply= (commentId,replyId,updatedReply) => api.put(`/comments/${commentId}/reply/${replyId}`,updatedReply);
export const deleteReply= (commentId,replyId)=>api.delete(`/comments/${commentId}/reply/${replyId}`);
