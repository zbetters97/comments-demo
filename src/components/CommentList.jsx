import { useEffect, useState } from "react";
import Comment from "./Comment";

export default function CommentList(props) {

  const { comments } = props;
  const [topLevelComments, setTopLevelComments] = useState([]);

  /* useEffect(() => {
     const filteredList = comments.filter((comment) => !comment.reply);
     setTopLevelComments(filteredList);
   }, [comments]);*/

  return (
    <>
      {comments.filter((comment) => !comment.reply).map((comment) => (
        <ul key={comment.id}>
          <li>
            <Comment key={comment.id} comment={comment} comments={comments} />
          </li>
        </ul>
      ))}
    </>
  );
}