import React, {Component} from 'react'
import gql from 'graphql-tag'
import {Mutation} from 'react-apollo'
import {Link} from 'react-router-dom'

import {Stage, Layer, Image, Text} from 'react-konva';
import useImage from 'use-image';


const ADD_LOGO = gql`
  mutation AddLogo(
    $text: String!
    $color: String!
    $fontSize: Int!
    $backgroundColor: String!
    $borderColor: String!
    $borderThickness: Int!
    $borderRadius: Int!
    $margin: Int!
    $padding: Int!
    $img: String!
    $dimension_horizontal: Int!
    $dimension_vertical: Int!
  ) {
    addLogo(
      text: $text
      color: $color
      fontSize: $fontSize
      backgroundColor: $backgroundColor
      borderColor: $borderColor
      borderThickness: $borderThickness
      borderRadius: $borderRadius
      margin: $margin
      padding: $padding
      img: $img
      dimension_horizontal: $dimension_horizontal
      dimension_vertical: $dimension_vertical
    ) {
      _id
    }
  }
`
const DragImage = ({url, width, height, onDragEnd}) => {
    const [img] = useImage(url);
    return <Image image={img} draggable x={0} y={0} width={width} height={height} onDragEnd={onDragEnd}/>;
};

class CreateLogoScreen extends Component {
    state = {
        text: [{content: 'gologolo Logo', x_pos: 10, y_pos: 10 }],
        color: '#ff0000',
        backgroundColor: '#00ff00',
        borderColor: '#0000ff',
        borderThickness: 4,
        borderRadius: 5,
        margin: 10,
        padding: 10,
        fontSize: 20,
        text_id: 0,
        img_id: 0,
        img: [{}],
        dimension_horizontal: 200,
        dimension_vertical: 200,
    };
    insertAfter = (newElement, targetElement) => {
        console.log(this.state.text_id);
        let parent = targetElement.parentNode;
        if (parent.lastChild === targetElement) {
            parent.appendChild(newElement);
        } else {
            parent.insertBefore(newElement, targetElement.nextSibling);
        }
    };

    addText = () => {
        this.state.text_id += 1;
        this.state.text[this.state.text_id] = {};
        console.log("add Text :::: ", this.state.text_id);

        let newDiv = document.createElement('div');
        newDiv.id = 'div' + this.state.text_id;

        let textDiv = document.createElement('div');
        textDiv.className = 'rowDiv';
        let newText = document.createElement('input');
        newText.id = 'input-' + this.state.text_id;
        newText.className = 'form-control';
        newText.oninput = event => {
            const textArray = this.state.text
            textArray[event.target.id.split('-')[1]].content = event.target.value;
            textArray[event.target.id.split('-')[1]].x_pos = 10;
            textArray[event.target.id.split('-')[1]].y_pos = (event.target.id.split('-')[1]  * 20) % this.state.dimension_vertical;
            this.setState({text: textArray})
        };
        textDiv.appendChild(newText);

        let buttonDiv = document.createElement('div');
        buttonDiv.className = 'rowDiv';
        let newButton = document.createElement('button');
        newButton.id = 'button-' + this.state.text_id;
        newButton.innerHTML = 'remove';
        newButton.onclick = event => {
            event.target.parentNode.parentNode.remove();
            const textArray = this.state.text;
            // textArray.splice(event.target.id.slice(-1), 1);
            delete textArray[event.target.id.split('-')[1]];
            this.setState({text: textArray});
            // let newTextId = this.state.text_id;
            // newTextId -= 1;
            // this.setState(({text_id: newTextId}))
            console.log(this.state.text);
            console.log("delete Text :::: ", event.target.id.slice(-1));
        };
        buttonDiv.appendChild(newButton);

        newDiv.appendChild(textDiv);
        newDiv.appendChild(buttonDiv);

        // this.insertAfter(
        //     newDiv,
        //     document.getElementById('div' + (this.state.text_id - 1))
        // );
        let parent = document.getElementById('textDiv').appendChild(newDiv);
    };
    addImg = () => {
        this.state.img_id += 1;
        this.state.img[this.state.img_id] = {};
        this.state.img[this.state.img_id].x_pos = 0;
        this.state.img[this.state.img_id].y_pos = 0;
        this.state.img[this.state.img_id].width = 100;
        this.state.img[this.state.img_id].height = 100;
        let newDiv = document.createElement('div');
        newDiv.id = 'img-div' + this.state.img_id;
        let imgDiv = document.createElement('div');
        imgDiv.className = 'rowDiv';

        let newURL = document.createElement('input');
        newURL.id = 'input' + this.state.img_id;
        newURL.type = 'text';
        newURL.className = 'form-control';
        newURL.placeholder = "enter image url";

        let widthLabel = document.createElement('label');
        widthLabel.innerText = "image width";
        let itsWidth = document.createElement('input');
        itsWidth.id = 'newImageWidth' + this.state.img_id;
        itsWidth.className = 'form-control';
        itsWidth.type = 'number';
        itsWidth.placeholder = 'enter image width';
        itsWidth.defaultValue = "100";

        let heightLabel = document.createElement('label');
        heightLabel.innerText = "image height";
        let itsHeight = document.createElement('input');
        itsHeight.id = 'newImageHeight' + this.state.img_id;
        itsHeight.className = 'form-control';
        itsHeight.type = 'number';
        itsHeight.placeholder = 'enter image height';
        itsHeight.defaultValue = "100";

        newURL.oninput = (e) => {
            const imgArray = this.state.img;
            imgArray[e.target.id.slice(-1)].url = e.target.value;
            this.setState({img: imgArray});
            console.log("new image input");
            console.log(this.state.img);
        };
        itsWidth.oninput = (e) => {
            const imgArray = this.state.img;
            imgArray[e.target.id.slice(-1)].width = e.target.value;
            this.setState({img: imgArray})
        };
        itsHeight.oninput = (e) => {
            const imgArray = this.state.img;
            imgArray[e.target.id.slice(-1)].height = e.target.value;
            this.setState({img: imgArray});
        };
        console.log("this.state.img: ", this.state.img);
        imgDiv.appendChild(newURL);
        imgDiv.appendChild(widthLabel);
        imgDiv.appendChild(itsWidth);
        imgDiv.appendChild(heightLabel);
        imgDiv.appendChild(itsHeight);


        let buttonDiv = document.createElement('div');
        buttonDiv.className = 'rowDiv';
        let newButton = document.createElement('button');
        newButton.id = 'button' + this.state.img_id;
        newButton.innerHTML = 'remove';
        newButton.onclick = event => {
            event.target.parentNode.parentNode.remove();
            const imgArray = this.state.img;
            imgArray.splice(event.target.id.slice(-1), 1);
            this.setState({img: imgArray});
            console.log(this.state.img);
        };
        buttonDiv.appendChild(newButton)

        newDiv.appendChild(imgDiv)
        newDiv.appendChild(buttonDiv)

        this.insertAfter(
            newDiv,
            document.getElementById('img-div' + (this.state.img_id - 1))
        )
    };

    handleDraggingEnd = (e, type, index) => {
        if (type === "text"){
            const textArray = this.state.text;
            textArray[index].x_pos = e.target.attrs.x;
            textArray[index].y_pos = e.target.attrs.y;
            this.setState({text:textArray});
            console.log(this.state.text);
        }
        else{
            const imgArray = this.state.img;
            imgArray[index].x_pos = e.target.attrs.x;
            imgArray[index].y_pos = e.target.attrs.y;
            this.setState({img:imgArray});
            console.log(this.state.img)
        }
    }


    render() {
        let text,
            color,
            fontSize,
            backgroundColor,
            borderColor,
            borderThickness,
            borderRadius,
            margin,
            padding,
            url,
            imgWidth,
            imgHeight,
            dimension_horizontal,
            dimension_vertical

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
            <Mutation mutation={ADD_LOGO} onCompleted={() => this.props.history.push('/')}>
                {(addLogo, {loading, error}) => (
                    <div className='container'>
                        <div className='panel panel-default'>
                            <div className='panel-heading'>
                                <h4>
                                    <Link to='/'>Home</Link>
                                </h4>
                                <h3 className='panel-title'>Create Logo</h3>
                            </div>
                            <div className='row'>
                                <div className='col s1'>
                                    <div className='panel-body'>
                                        <form
                                            onSubmit={e => {
                                                e.preventDefault();
                                                let newArr = [];
                                                this.state.text.map((value) => {
                                                    if (value !== null){
                                                        newArr.push(value)
                                                    }
                                                })
                                                // this.setState({text: newArr})
                                                // console.log("text: ", this.state.text);
                                                addLogo({
                                                    variables: {
                                                        text: JSON.stringify(newArr),
                                                        color: this.state.color,
                                                        fontSize: parseInt(this.state.fontSize),
                                                        backgroundColor: this.state.backgroundColor,
                                                        borderColor: this.state.borderColor,
                                                        borderThickness: parseInt(this.state.borderThickness),
                                                        borderRadius: parseInt(this.state.borderRadius),
                                                        margin: parseInt(this.state.margin),
                                                        padding: parseInt(this.state.padding),
                                                        img: JSON.stringify(this.state.img),
                                                        dimension_horizontal: parseInt(this.state.dimension_horizontal),
                                                        dimension_vertical: parseInt(this.state.dimension_vertical),
                                                    }
                                                })
                                            }}
                                        >
                                            <div className='form-group'>
                                                <label htmlFor='dimension_horizontal'>dimension_horizontal:</label>
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
                                                <label htmlFor='dimension_vertical'>dimension_vertical:</label>
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
                                            <div id='textDiv'>
                                            <div id='div0'>
                                                <div className='rowDiv'>
                                                    <label htmlFor='text'>Text:</label>
                                                    <input
                                                        id='input0'
                                                        type='text'
                                                        className='form-control'
                                                        name='text'
                                                        ref={node => {
                                                            text = node
                                                        }}
                                                        onChange={() => {
                                                            const textArray = this.state.text;
                                                            textArray[0].content = text.value;
                                                            this.setState({text: textArray})
                                                        }}
                                                        placeholder='Text'
                                                        defaultValue={this.state.text[0].content}
                                                    />
                                                </div>
                                            </div></div>
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
                                            <button type='submit' className='btn btn-success'>
                                                Submit
                                            </button>
                                        </form>
                                        {loading && <p>Loading...</p>}
                                        {error && <p>Error :( Please try again</p>}
                                    </div>
                                </div>


                                <div>
                                    <div className='col s4'>
                                        <Stage id="my-node" width={this.state.dimension_horizontal} height={this.state.dimension_vertical} style={styles.container}>
                                            <Layer id="konvaLayer">
                                                {this.state.text.map((value, index) => (
                                                    <Text
                                                        id={index} key={index}
                                                        draggable='true'
                                                        key={index}
                                                        fill={this.state.color}
                                                        x={20}
                                                        y={20 * index % this.state.dimension_horizontal}
                                                        text={value.content}
                                                        fontSize = {this.state.fontSize}
                                                        // onDragStart={(e) => this.handleDraggingStart(e, "text")}
                                                        onDragEnd={(e) => this.handleDraggingEnd(e, "text", index)}
                                                    />
                                                ))}
                                                {this.state.img.map((img, index) => (
                                                    <DragImage key={index} url={img.url} width={img.width}
                                                               height={img.height}
                                                               // onDragStart={(e) => this.handleDraggingStart(e, "img")}
                                                               onDragEnd={(e) => this.handleDraggingEnd(e, "img", index)}

                                                    />
                                                ))}
                                            </Layer>
                                        </Stage>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Mutation>
        )
    }
}

export default CreateLogoScreen
