import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import '../App.css';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';

const GET_LOGOS = gql`
  
 {logos
     {
      _id
      text
      lastUpdate
      }
  }

`;

class HomeScreen extends Component {

    render() {
        return (
            <Query pollInterval={500} query={GET_LOGOS}>
                {({loading, error, data}) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;
                    console.log(data);
                    return (
                        <div className="container row">
                            <div className="col s1">
                            </div>
                            <div className="col s2">
                                <h3>Recent Work</h3>
                                {data.logos.map((logo, index) => (
                                    <div key={index} className='home_logo_link'
                                         style={{cursor: "pointer"}}>
                                        <Link to={`/view/${logo._id}`}>
                                            {JSON.parse(logo.text).map((txt)=>
                                                (txt.content + " "))}</Link>
                                    </div>
                                ))}
                            </div>
                            <div className="col s8">
                                <div id="home_banner_container">
                                    List Maker
                                </div>
                                <div className="row col s9">
                                    <button onClick={() => this.props.history.push('/create')}>Create A New Logo
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                }
                }
            </Query>
        );
    }
}

export default HomeScreen;
