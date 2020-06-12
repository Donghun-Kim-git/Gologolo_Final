import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import gql from "graphql-tag";
import {Query, Mutation} from "react-apollo";
import {Image, Layer, Stage, Text} from "react-konva";
import useImage from "use-image";


const DragImage = ({url, width, height, onDragEnd, x, y}) => {
    const [img] = useImage(url);
    return <Image image={img} draggable x={x} y={y} width={width} height={height} onDragEnd={onDragEnd}/>;
};
// this is gonna pull the logo based on id number and it is gonna pull _id, text, color, fontsize
const GET_LOGO = gql` 
    query logo($logoId: String) {
        logo(id: $logoId) {
            _id
            text
            color
            fontSize
            backgroundColor
            borderColor
            borderRadius
            borderThickness
            padding
            margin
            img
            dimension_horizontal
            dimension_vertical
            lastUpdate
        }
    }
`;

const UPDATE_LOGO = gql`
    mutation updateLogo(
        $id: String!,
        $text: String!,
        $color: String!,
        $fontSize: Int!,
        $backgroundColor: String!,
        $borderColor: String!,
        $borderRadius: Int!,
        $borderThickness: Int!,
        $padding: Int!,
        $margin: Int!,
        $img: String!,
        $dimension_horizontal: Int!,
        $dimension_vertical: Int!
        ) {
        updateLogo(
            id: $id,
            text: $text,
            color: $color,
            fontSize: $fontSize,
            backgroundColor: $backgroundColor,
            borderColor: $borderColor,
            borderRadius: $borderRadius,
            borderThickness: borderThickness,
            padding: $padding,
            margin: $margin
            img: $img
            dimension_horizontal: $dimension_horizontal
            dimension_vertical: $dimension_vertical
        ) {
        lastUpdate
        }
      }
`;

class EditLogoScreen extends Component {


    constructor(props) {
        super(props);
        this.state = {
            text: JSON.parse(this.props.history.location.state.currentLogo.text),
            color: this.props.history.location.state.currentLogo.color,
            fontSize: this.props.history.location.state.currentLogo.fontSize,
            backgroundColor: this.props.history.location.state.currentLogo.backgroundColor,
            borderColor: this.props.history.location.state.currentLogo.borderColor,
            borderRadius: this.props.history.location.state.currentLogo.borderRadius,
            borderThickness: this.props.history.location.state.currentLogo.borderThickness,
            padding: this.props.history.location.state.currentLogo.padding,
            margin: this.props.history.location.state.currentLogo.margin,
            img: JSON.parse(this.props.history.location.state.currentLogo.img),
            dimension_horizontal: this.props.history.location.state.currentLogo.dimension_horizontal,
            dimension_vertical: this.props.history.location.state.currentLogo.dimension_vertical,
            text_id: JSON.parse(this.props.history.location.state.currentLogo.text).length,
            img_id: JSON.parse(this.props.history.location.state.currentLogo.img).length,
        };
    }

    handleDraggingStart = (e) => {
        console.log(e.target);
    }
    handleDraggingEnd = (e, type, index) => {
        if (type === "text") {
            const textArray = this.state.text;
            textArray[index].x_pos = e.target.attrs.x;
            textArray[index].y_pos = e.target.attrs.y;
            this.setState({text: textArray});
            console.log(this.state.text);
        } else {
            const imgArray = this.state.img;
            imgArray[index].x_pos = e.target.attrs.x;
            imgArray[index].y_pos = e.target.attrs.y;
            this.setState({img: imgArray});
            console.log(this.state.img)
        }
    };


    addText = () => {
        let newTextId = this.state.text_id;
        newTextId += 1;
        let textArray = this.state.text;
        textArray[this.state.text_id] = {};
        this.setState({text: textArray});
        this.setState({text_id: newTextId})
    };
    addImg = () => {
        let newImageId = this.state.img_id;
        newImageId += 1;
        let imageArray = this.state.img;
        imageArray[this.state.img_id] = {};
        this.setState({img: imageArray});
        this.setState({img_id: newImageId});
    };

    render() {
        let text, color, fontSize, backgroundColor, borderColor, borderRadius, borderThickness, padding, margin,
            imgWidth, imgHeight, dimension_vertical, dimension_horizontal, url;
        const styles = {
            container: {
                color: this.state.color,
                fontSize: this.state.fontSize + 'pt',
                backgroundColor: this.state.backgroundColor,
                border: this.state.borderThickness + 'px solid ' + this.state.borderColor,
                borderRadius: this.state.borderRadius + 'px',
                margin: this.state.margin + 'px',
                padding: this.state.padding + 'px',
                textAlign: 'center'
            }
        };
        return (
            <Query query={GET_LOGO} variables={{logoId: this.props.match.params.id}}>
                {({loading, error, data}) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;
                    return (
                        <Mutation
                            mutation={UPDATE_LOGO}
                            key={data.logo._id}
                            onCompleted={() => this.props.history.push(`/`)}
                        >
                            {(updateLogo, {loading, error}) => (
                                <div className="container">
                                    <div className="card">
                                        <div className="card-header">
                                            <h4><Link to="/">Home</Link></h4>
                                            <h3 className="panel-title">Edit Logo</h3>
                                        </div>
                                        <div className="card-body">
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    updateLogo({
                                                        variables: {
                                                            id: data.logo._id,
                                                            text: JSON.stringify(this.state.text),
                                                            color: color.value,
                                                            fontSize: parseInt(fontSize.value),
                                                            backgroundColor: backgroundColor.value,
                                                            borderColor: borderColor.value,
                                                            borderRadius: parseInt(borderRadius.value),
                                                            borderThickness: parseInt(
                                                                borderThickness.value
                                                            ),
                                                            padding: parseInt(padding.value),
                                                            margin: parseInt(margin.value),
                                                            dimension_horizontal: parseInt(dimension_horizontal.value),
                                                            dimension_vertical: parseInt(dimension_vertical.value),
                                                            image: JSON.stringify(this.state.img)
                                                        },
                                                    });
                                                    color.value = "";
                                                    fontSize.value = "";
                                                    backgroundColor.value = "";
                                                    borderColor.value = "";
                                                    borderRadius.value = "";
                                                    borderThickness.value = "";
                                                    padding.value = "";
                                                    margin.value = "";
                                                }}
                                            >
                                                <div className="row">
                                                    <div className="col-3">
                                                        <div className='form-group'>
                                                            <label
                                                                htmlFor='dimension_horizontal'>dimension_horizontal:</label>
                                                            <input
                                                                type='number'
                                                                className='form-control'
                                                                name='dimensionHorizontal'
                                                                ref={node => {
                                                                    dimension_horizontal = node
                                                                }}
                                                                onChange={() => {
                                                                    this.setState({dimension_horizontal: dimension_horizontal.value})
                                                                }}
                                                                placeholder='Dimension_horizontal'
                                                                defaultValue={this.state.dimension_horizontal}
                                                            />
                                                        </div>
                                                        <div className='form-group'>
                                                            <label
                                                                htmlFor='dimension_vertical'>dimension_vertical:</label>
                                                            <input
                                                                type='number'
                                                                className='form-control'
                                                                name='dimensionVertical'
                                                                ref={node => {
                                                                    dimension_vertical = node
                                                                }}
                                                                onChange={() => {
                                                                    this.setState({dimension_vertical: dimension_vertical.value})
                                                                }}
                                                                placeholder='Dimension_vertical'
                                                                defaultValue={this.state.dimension_vertical}
                                                            />
                                                        </div>
                                                        <div id='div0'>
                                                            <div className='rowDiv'>
                                                                <label htmlFor='text'>Text:</label>
                                                                {this.state.text.map((value, index) => (
                                                                        <div key={index}>
                                                                            <input
                                                                                id={'input' + index}
                                                                                type='text'
                                                                                className='form-control'
                                                                                name='text'

                                                                                onChange={(e) => {
                                                                                    const textArray = this.state.text
                                                                                    textArray[index].content = e.target.value
                                                                                    this.setState({text: textArray})
                                                                                }}
                                                                                placeholder='Text'
                                                                                value={value.content}
                                                                            />
                                                                            <button id={'button' + index}
                                                                                    onClick={(e) => {
                                                                                        // e.target.parentNode.remove();
                                                                                        let newTextIndex = this.state.text_id;
                                                                                        newTextIndex -= 1;
                                                                                        const textArray = this.state.text;
                                                                                        textArray.splice(index, 1);
                                                                                        this.setState({
                                                                                            text: textArray,
                                                                                            text_id: newTextIndex
                                                                                        });
                                                                                        console.log("text:", this.state.text);

                                                                                        e.preventDefault();
                                                                                    }}>
                                                                                remove
                                                                            </button>

                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                        <button className='btn btn-light btn-outline-dark'
                                                                onClick={event => {
                                                                    event.preventDefault();
                                                                    this.addText();
                                                                }}
                                                        >
                                                            add Text
                                                        </button>

                                                        <div className='form-group'>
                                                            <label htmlFor='color'>Color:</label>
                                                            <input
                                                                type='color'
                                                                className='form-control'
                                                                name='color'
                                                                ref={node => {
                                                                    color = node
                                                                }}
                                                                onChange={() => {
                                                                    this.setState({color: color.value})
                                                                }}
                                                                placeholder='Color'
                                                                defaultValue={this.state.color}
                                                            />
                                                        </div>
                                                        <div className='form-group'>
                                                            <label htmlFor='fontSize'>Font Size:</label>
                                                            <input
                                                                type='number'
                                                                className='form-control'
                                                                name='fontSize'
                                                                min={2}
                                                                max={144}
                                                                ref={node => {
                                                                    fontSize = node
                                                                }}
                                                                onChange={() => {
                                                                    this.setState({fontSize: fontSize.value})
                                                                }}
                                                                placeholder='Font Size'
                                                                defaultValue={this.state.fontSize}
                                                            />
                                                        </div>
                                                        <div className='form-group'>
                                                            <label htmlFor='backgroundColor'>
                                                                Background Color:
                                                            </label>
                                                            <input
                                                                type='color'
                                                                className='form-control'
                                                                name='backgroundColor'
                                                                ref={node => {
                                                                    backgroundColor = node
                                                                }}
                                                                onChange={() => {
                                                                    this.setState({
                                                                        backgroundColor: backgroundColor.value
                                                                    })
                                                                }}
                                                                placeholder='Background Color'
                                                                defaultValue={this.state.backgroundColor}
                                                            />
                                                        </div>
                                                        <div className='form-group'>
                                                            <label htmlFor='borderColor'>Border Color:</label>
                                                            <input
                                                                type='color'
                                                                className='form-control'
                                                                name='borderColor'
                                                                ref={node => {
                                                                    borderColor = node
                                                                }}
                                                                onChange={() => {
                                                                    this.setState({borderColor: borderColor.value})
                                                                }}
                                                                placeholder='Border Color'
                                                                defaultValue={this.state.borderColor}
                                                            />
                                                        </div>
                                                        <div className='form-group'>
                                                            <label htmlFor='borderThickness'>
                                                                Border Thickness:
                                                            </label>
                                                            <input
                                                                type='number'
                                                                className='form-control'
                                                                name='borderThickness'
                                                                min={2}
                                                                max={40}
                                                                ref={node => {
                                                                    borderThickness = node
                                                                }}
                                                                onChange={() => {
                                                                    this.setState({
                                                                        borderThickness: borderThickness.value
                                                                    })
                                                                }}
                                                                placeholder='Border Thickness'
                                                                defaultValue={this.state.borderThickness}
                                                            />
                                                        </div>
                                                        <div className='form-group'>
                                                            <label htmlFor='borderRadius'>Border Radius:</label>
                                                            <input
                                                                type='number'
                                                                className='form-control'
                                                                name='borderRadius'
                                                                min={2}
                                                                max={20}
                                                                ref={node => {
                                                                    borderRadius = node
                                                                }}
                                                                onChange={() => {
                                                                    this.setState({borderRadius: borderRadius.value})
                                                                }}
                                                                placeholder='Border Radius'
                                                                defaultValue={this.state.borderRadius}
                                                            />
                                                        </div>
                                                        <div className='form-group'>
                                                            <label htmlFor='margin'>Margin:</label>
                                                            <input
                                                                type='number'
                                                                className='form-control'
                                                                name='margin'
                                                                min={2}
                                                                max={100}
                                                                ref={node => {
                                                                    margin = node
                                                                }}
                                                                onChange={() => {
                                                                    this.setState({margin: margin.value})
                                                                }}
                                                                placeholder='Margin'
                                                                defaultValue={this.state.margin}
                                                            />
                                                        </div>
                                                        <div className='form-group'>
                                                            <label htmlFor='padding'>Padding:</label>
                                                            <input
                                                                type='number'
                                                                className='form-control'
                                                                name='padding'
                                                                min={2}
                                                                max={100}
                                                                ref={node => {
                                                                    padding = node
                                                                }}
                                                                onChange={() => {
                                                                    this.setState({padding: padding.value})
                                                                }}
                                                                placeholder='Padding'
                                                                defaultValue={this.state.padding}
                                                            />
                                                        </div>

                                                        <div id='img-div0'>
                                                            <div className='rowDiv'>
                                                                <label htmlFor='text'>Img:</label>
                                                                {this.state.img.map((value, index) => (
                                                                    <div key={index}>
                                                                        <input
                                                                            id='inputImage0'
                                                                            type='text'
                                                                            className='form-control'
                                                                            name='image'
                                                                            ref={node => {
                                                                                url = node
                                                                            }}
                                                                            onChange={() => {
                                                                                const imgArray = this.state.img
                                                                                imgArray[0].url = url.value;
                                                                                this.setState({img: imgArray});
                                                                                console.log("image: ", this.state.img)
                                                                            }}
                                                                            placeholder='enter image url'
                                                                            value={value.url}
                                                                        />
                                                                        <input
                                                                            type='number'
                                                                            className='form-control'
                                                                            name='image width'
                                                                            ref={node => {
                                                                                imgWidth = node
                                                                            }}
                                                                            onChange={() => {
                                                                                const imgArray = this.state.img;
                                                                                imgArray[0].width = parseInt(imgWidth.value);
                                                                                this.setState({img: imgArray});
                                                                            }}
                                                                            placeholder='enter image width'
                                                                            defaultValue={100}
                                                                        />
                                                                        <input
                                                                            type='number'
                                                                            className='form-control'
                                                                            name='image height'
                                                                            ref={node => {
                                                                                imgHeight = node
                                                                            }}
                                                                            onChange={() => {
                                                                                const imgArray = this.state.img;
                                                                                imgArray[0].height = parseInt(imgHeight.value);
                                                                                this.setState({img: imgArray});
                                                                            }}
                                                                            placeholder='enter image height'
                                                                            defaultValue={100}
                                                                        />
                                                                        <div className='rowDiv'>
                                                                            <button id='button0'
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        let newImageIndex = this.state.img_id;
                                                                                        newImageIndex -= 1;
                                                                                        const imgArray = this.state.img;
                                                                                        imgArray.splice(index, 1);
                                                                                        this.setState({
                                                                                            img: imgArray,
                                                                                            img_id: newImageIndex
                                                                                        });
                                                                                    }}
                                                                            >
                                                                                remove
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                            </div>
                                                        </div>
                                                        <button className='btn btn-dark'
                                                                onClick={event => {
                                                                    event.preventDefault();
                                                                    this.addImg()
                                                                }}
                                                        >
                                                            add image
                                                        </button>
                                                    </div>

                                                    <div className='col-auto'>
                                                        <div className="d-flex">
                                                            <Stage width={parseInt(this.state.dimension_horizontal)}
                                                                   height={parseInt(this.state.dimension_vertical)}
                                                                   style={styles.container}>
                                                                <Layer id="konvaLayer">
                                                                    {this.state.text.map((value, index) => (
                                                                        <Text
                                                                            draggable
                                                                            id={index} key={index}
                                                                            fill={this.state.color}
                                                                            x={value.x_pos}
                                                                            y={value.y_pos}
                                                                            text={value.content}
                                                                            fontSize={this.state.fontSize}
                                                                            onDragStart={(e) => this.handleDraggingStart(e)}
                                                                            onDragEnd={(e) => this.handleDraggingEnd(e, "text", index)}
                                                                        />
                                                                    ))}
                                                                    {this.state.img.map((img, index) => (
                                                                        <DragImage key={index} url={img.url}
                                                                                   x={img.x_pos}
                                                                                   y={img.y_pos}
                                                                                   width={img.width}
                                                                                   height={img.height}
                                                                                   onDragEnd={(e) => this.handleDraggingEnd(e, "img", index)}
                                                                        />
                                                                    ))}
                                                                </Layer>
                                                            </Stage>
                                                        </div>
                                                    </div>
                                                </div>


                                                <button type='submit' className='btn btn-success'>
                                                    Submit
                                                </button>
                                                {loading && <p>Loading...</p>}
                                                {error && <p>Error :( Please try again</p>}
                                            </form>
                                        </div>


                                    </div>
                                </div>


                            )}
                        </Mutation>
                    );
                }}
            </Query>
        );
    }
}

export default EditLogoScreen;