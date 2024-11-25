import React from 'react'
import "./Home.css"
import Header from '../../components/Header'
import ExploreMenu from '../../components/ExploreMenu'
import Recommended from '../../components/Recommended'
import Footer from '../../components/Footer'
// import Dashboard from '../admin/Dashboard'

const Home = () => {
    return (
        <div>
            <Header/>
            <ExploreMenu/>
            <Recommended/>
            <Footer/>
            {/* <Dashboard/> */}
        </div>
    )
}

export default Home
