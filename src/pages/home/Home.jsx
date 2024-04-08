import Stories from "../../components/stories/Stories"
import Posts from "../../components/posts/Posts"
import Share from "../../components/share/Share"
import "./home.scss"

const Home = (props) => {
  const { isRefecth } = props;

  return (
    <div className="home">
      <Share/>
      <Posts isRefecth={isRefecth}/>
    </div>
  )
}

export default Home