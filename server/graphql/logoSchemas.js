var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var LogoModel = require('../models/Logo'); // Logo.js ㅇㅔ서 정의해준 데이타 구조를 받는다

var logoType = new GraphQLObjectType({
    name: 'logo',
    fields: function () {
        return {
            _id: {
                type: GraphQLString
            },
            text: {
                type: GraphQLString //modified
            },
            color: {
                type: GraphQLString
            },
            fontSize: {
                type: GraphQLInt
            },
            backgroundColor: {
                type: GraphQLString
            },
            borderColor: {
                type: GraphQLString
            },
            borderThickness: {
                type: GraphQLInt
            },
            borderRadius: {
                type: GraphQLInt
            },
            margin: {
                type: GraphQLInt
            },
            padding: {
                type: GraphQLInt
            },
            img: {
                type: GraphQLString
            },
            dimension_horizontal: {
                type: GraphQLInt
            },
            dimension_vertical: {
                type: GraphQLInt
            },
            lastUpdate: {
                type: GraphQLDate
            },
        }
    }
});

var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function () {
        return {
            logos: {
                type: new GraphQLList(logoType),
                resolve: function () {
                    const logos = LogoModel.find().sort({lastUpdate: -1}).exec();
                    if (!logos) {
                        throw new Error('Error')
                    }
                    return logos
                }
            },
            logosrt: {
                type: new GraphQLList(logoType),
                resolve: function () {
                    const logos = LogoModel.find().sort({lastUpdate: 1}).exec();
                    if (!logos) {
                        throw new Error('Error')
                    }
                    return logos
                }
            },
            logo: {
                type: logoType,
                args: {
                    id: {
                        name: '_id',
                        type: GraphQLString
                    }
                },
                resolve: function (root, params) {
                    const logoDetails = LogoModel.findById(params.id).exec();
                    if (!logoDetails) {
                        throw new Error('Error')
                    }
                    return logoDetails
                }
            },
            findText: {
                type: logoType,
                args: {
                    text: {
                        name: 'text',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                },
                resolve: function (root, params) {
                    const logo = LogoModel.find().filter(text === params.text).exec();
                    if (!logo) {
                        throw  Error('Error')
                    }
                    return logo

                }
            },
        }
    }
});

var mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function () {
        return {
            addLogo: {
                type: logoType,
                args: {
                    text: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    color: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    fontSize: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    backgroundColor: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    borderColor: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    borderThickness: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    borderRadius: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    margin: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    padding: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    img: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    dimension_horizontal: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    dimension_vertical: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },

                },
                resolve: function (root, params) {
                    const logoModel = new LogoModel(params);
                    const newLogo = logoModel.save();
                    if (!newLogo) {
                        throw new Error('Error');
                    }
                    return newLogo
                }
            },
            updateLogo: {
                type: logoType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    text: {
                        type: new GraphQLNonNull(GraphQLList(GraphQLString))
                    },
                    color: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    fontSize: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    backgroundColor: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    borderColor: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    borderThickness: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    borderRadius: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    margin: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    padding: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    img: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    dimension_horizontal: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    dimension_vertical: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },

                },
                resolve(root, params) {
                    return LogoModel.findByIdAndUpdate(params.id, {
                        text: params.text,
                        color: params.color,
                        fontSize: params.fontSize,
                        backgroundColor: params.backgroundColor,
                        borderColor: params.borderColor,
                        borderThickness: params.borderThickness,
                        borderRadius: params.borderRadius,
                        margin: params.margin,
                        padding: params.padding,
                        img: params.img,
                        dimension_horizontal: params.dimension_horizontal,
                        dimension_vertical: params.dimension_vertical,
                        lastUpdate: new Date()
                    }, function (err) {
                        if (err) return next(err);
                    });
                }
            },

            removeLogo: {
                type: logoType,
                args: {
                    id: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params) {
                    const remLogo = LogoModel.findByIdAndRemove(params.id).exec();
                    if (!remLogo) {
                        throw new Error('Error')
                    }
                    return remLogo;
                }
            },
            clearLogos: {
                type: new GraphQLList(logoType),
                resolve: function () {
                    const logos = LogoModel.find().remove().exec();
                    if (!logos) {
                        throw new Error('Error')
                    }
                    return LogoModel.find()
                }
            }
        }
    }
});

module.exports = new GraphQLSchema({query: queryType, mutation: mutation});
