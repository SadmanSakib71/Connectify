const mapAuthor = (row) => ({
  id: row.user_id || row.author_id,
  firstName: row.first_name,
  lastName: row.last_name,
});

const mapPost = (row, likeInfo = {}, commentCount = 0) => ({
  id: row.id,
  text: row.text,
  imageUrl: row.image_url || null,
  visibility: row.visibility,
  createdAt: row.created_at,
  author: {
    id: row.user_id,
    firstName: row.first_name,
    lastName: row.last_name,
  },
  likeCount: likeInfo.likeCount || 0,
  isLiked: likeInfo.isLiked || false,
  likedBy: likeInfo.likedBy || [],
  commentCount,
});

const mapComment = (row, likeInfo = {}, replies = []) => ({
  id: row.id,
  postId: row.post_id,
  text: row.text,
  createdAt: row.created_at,
  author: {
    id: row.user_id,
    firstName: row.first_name,
    lastName: row.last_name,
  },
  likeCount: likeInfo.likeCount || 0,
  isLiked: likeInfo.isLiked || false,
  likedBy: likeInfo.likedBy || [],
  replies,
});

const mapReply = (row, likeInfo = {}) => ({
  id: row.id,
  commentId: row.comment_id,
  text: row.text,
  createdAt: row.created_at,
  author: {
    id: row.user_id,
    firstName: row.first_name,
    lastName: row.last_name,
  },
  likeCount: likeInfo.likeCount || 0,
  isLiked: likeInfo.isLiked || false,
  likedBy: likeInfo.likedBy || [],
});

module.exports = { mapAuthor, mapPost, mapComment, mapReply };
