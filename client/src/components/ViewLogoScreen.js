import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import '../App.css';
import gql from 'graphql-tag';
import {Query, Mutation} from 'react-apollo';
import html2canvas from "html2canvas";

const GET_LOGO = gql`
    query logo($logoId: String) {
        logo(id: $logoId) {
            _id
            text
            color
            fontSize
            backgroundColor
            borderColor
            borderThickness
            borderRadius
            margin
            padding
            img
            dimension_horizontal
            dimension_vertical
            lastUpdate
        }
    }
`;

const DELETE_LOGO = gql`
  mutation removeLogo($id: String!) {
    removeLogo(id:$id) {
      _id
    }
  }
`;

class ViewLogoScreen extends Component {
    canvasFrame = React.createRef();

    saveAsPNG = () => {
        window.scrollTo(0,0);
        console.log(this.canvasFrame.current);
        html2canvas(this.canvasFrame.current)
            .then(function (canvas) {
                let saved = canvas.toDataURL("image/png", 1.0);
                let link = document.createElement("a");
                link.download = "stage.png";
                link.href = saved;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
    };
    render() {
        return (
            <Query pollInterval={500} query={GET_LOGO} variables={{logoId: this.props.match.params.id}}>
                {({loading, error, data}) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;

                    return (
                        <div className="container">
                            <div className="panel panel-default">
                                <div className="panel-heading">
                                    <h4><Link to="/">Home</Link></h4>
                                    <h3 className="panel-title">
                                        View Logo
                                    </h3>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-3">
                                            <dl>
                                                <dt>Text:</dt>
                                                <dd>{JSON.parse(data.logo.text).map((txt)=>
                                                    (txt.content + "\n"))}</dd>
                                                <dt>Color:</dt>
                                                <dd>{data.logo.color}</dd>
                                                <dt>Font Size:</dt>
                                                <dd>{data.logo.fontSize}</dd>
                                                <dt>Background Color:</dt>
                                                <dd>{data.logo.backgroundColor}</dd>
                                                <dt>Border Color:</dt>
                                                <dd>{data.logo.borderColor}</dd>
                                                <dt>Border Radius:</dt>
                                                <dd>{data.logo.borderRadius}</dd>
                                                <dt>Border Width:</dt>
                                                <dd>{data.logo.borderThickness}</dd>
                                                <dt>Padding:</dt>
                                                <dd>{data.logo.padding}</dd>
                                                <dt>Margin:</dt>
                                                <dd>{data.logo.margin}</dd>
                                                <dt>img:</dt>
                                                <dd>{JSON.parse(data.logo.img).map((img) => (img.url + "\n"))}</dd>
                                                {/*<dd>*/}
                                                {/*    {JSON.parse(data.logo.img).map((img)=>*/}
                                                {/*        (<img src={img.url}/>)*/}
                                                {/*    )} </dd>*/}
                                                <dt>dimension_horizontal:</dt>
                                                <dd>{data.logo.dimension_horizontal}</dd>
                                                <dt>dimension_vertical:</dt>
                                                <dd>{data.logo.dimension_vertical}</dd>
                                                <dt>Last Updated:</dt>
                                                <dd>{data.logo.lastUpdate}</dd>
                                            </dl>
                                        </div>
                                        <div className="col-auto">
                                            <div ref={this.canvasFrame}>
                                                <CanvasDraw logo={data.logo} style={
                                                    {
                                                        textAlign: "center",
                                                        color: data.logo.color,
                                                        fontSize: data.logo.fontSize,
                                                        backgroundColor: data.logo.backgroundColor,
                                                        border: data.logo.borderThickness + "px solid " + data.logo.borderColor,
                                                        borderRadius: data.logo.borderRadius,
                                                        padding: data.logo.padding,
                                                        margin: data.logo.margin,
                                                        width: data.logo.dimension_horizontal + 2 * (data.logo.padding + data.logo.borderThickness),
                                                        height: data.logo.dimension_vertical + 2 * (data.logo.padding + data.logo.borderThickness)
                                                    }
                                                }/>
                                            </div>
                                            <button onClick={this.saveAsPNG}>save</button>

                                        </div>
                                    </div>

                                    <Mutation mutation={DELETE_LOGO} key={data.logo._id}
                                              onCompleted={() => this.props.history.push('/')}>
                                        {(removeLogo, {loading, error}) => (
                                            <div>
                                                <form
                                                    onSubmit={e => {
                                                        e.preventDefault();
                                                        removeLogo({variables: {id: data.logo._id}});
                                                    }}>
                                                    <Link to={{
                                                        pathname:`/edit/${data.logo._id}`,
                                                        state: {currentLogo: data.logo}
                                                    }} className="btn btn-success">Edit</Link>&nbsp;
                                                    <button type="submit" className="btn btn-danger">Delete</button>
                                                </form>
                                                {loading && <p>Loading...</p>}
                                                {error && <p>Error :( Please try again</p>}
                                            </div>
                                        )}
                                    </Mutation>
                                </div>
                            </div>
                        </div>
                    );
                }}
            </Query>
        );
    }
}
class CanvasDraw extends Component{
    canvasRef = React.createRef();

    buildCanvas = (logo) =>{
        setTimeout(() => {
            var c = this.canvasRef.current;
            console.log(c);
            var ctx = c.getContext("2d");
            JSON.parse(logo.img).map((value)=>{
                const img = new Image();
                img.src = value.url;
                img.crossOrigin = "anonymous";
                img.onload = () => {
                    console.log("img: ", value);
                    ctx.drawImage(img, value.x_pos, value.y_pos, value.width, value.height);
                    console.log("loaded image");
                    console.log(value.x_pos, value.y_pos, value.width, value.height);
                }
            })

            JSON.parse(logo.text).map((value)=>{
                ctx.fillStyle = logo.color;
                ctx.font = logo.fontSize + "px sans-serif";
                ctx.fillText(value.content, value.x_pos, value.y_pos + 3/4 * logo.fontSize);
            })
        }, 500)

    };

    render(){
        return(
            <div style={this.props.style}>
                <canvas ref={this.canvasRef} width={this.props.logo.dimension_horizontal} height={this.props.logo.dimension_vertical}/>
                {this.buildCanvas(this.props.logo)}
            </div>

        );
    }
}


export default ViewLogoScreen;
