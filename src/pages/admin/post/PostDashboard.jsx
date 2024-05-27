import './postDashboard.scss'
import Posts from "../../../components/posts/Posts";

function PostDashboard() {
    return (
        <div>
            <Posts isAdmin />
        </div>
    );
}

export default PostDashboard;