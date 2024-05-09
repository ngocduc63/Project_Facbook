import Stories from "../../components/stories/Stories"
import Posts from "../../components/posts/Posts"
import Share from "../../components/share/Share"
import { memo, useContext } from 'react'
import "./home.scss"
import { HomeContext } from "../../context/homeContext"

const Home = () => {
  const { isRefetch } = useContext(HomeContext)

  return (
    <div className="home">
      <Share />
      <Posts isRefecth={isRefetch} />
    </div>
  )
}

export default memo(Home)