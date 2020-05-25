import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, Modal, Button, StyleSheet } from 'react-native';
import { Card, Input, Icon, Rating } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}
// mapping to be done

const mapDispatchToProps = dispatch => ({
    postFavorite: dishId => dispatch(postFavorite(dishId)),
    postComment: (dishId, author, comment, rating) => dispatch(postComment(dishId, author, comment, rating))
})

function RenderComments(props) {
    const comments = props.comments;
    console.log("Comments: " + JSON.stringify(comments));

    const renderCommentItem = ({ item, index }) => {
        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text>
                <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date}</Text>
            </View>
        );
    }

    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>    
            <Card title="Comments">
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.dishId.toString()}
                />
            </Card>
        </Animatable.View>

    )
}

class DishDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rating: '',
            author: '',
            comment: '',
            date: '',
            showModal: false
        }
    }

    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }

    resetForm() {
        this.setState({
            rating: '',
            author: '',
            comment: '',
            date: '',
            showModal: false
        });
    }

    handleCommentSubmit(dishId) {
        console.log("In handleCommentSubmit");
        console.log(JSON.stringify(this.state));
        this.props.postComment(dishId, this.state.author, this.state.comment, this.state.rating);
        this.toggleModal();
        this.resetForm();
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    static navigationOptions = {
        title: 'Dish Details',

    };

    render() {
        const dishId = this.props.navigation.getParam('dishId', '');

        const RenderDish = (props) => {
            const dish = props.dish;
            console.log("Dish: " + JSON.stringify(dish));

            if (dish != null) {
                console.log("try to render card");
                console.log("Props: " + JSON.stringify(props));
                return (
                    <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
                        <Card
                            featuredTitle={dish.name}
                            image={{ uri: baseUrl + dish.image }}
                        >
                            <Text style={{ margin: 10 }}>
                                {dish.description}
                            </Text>
                            <View style={styles.formRow}>
                            <Icon
                                key={0}
                                raised
                                reversed
                                name={props.favorite ? 'heart' : 'heart-o'}
                                type='font-awesome'
                                color='#f50'
                                style={styles.formItem}
                                onPress={() => props.favorite ? console.log('already favorite') : props.onPress()} />
                            <Icon
                                key={1}
                                raised
                                reversed
                                reverseColor="512DA8"
                                name={'pencil'}
                                type='font-awesome'
                                style={styles.formItem}
                                color='#512DA8'
                                onPress={() => { this.toggleModal() }} />
                            </View>
                        </Card>
                    </Animatable.View>
                );
            } else {
                console.log("Returning empty view");
                return (
                    <View></View>
                );
            }
        }

        console.log('dishId: ' + dishId);
        return (
            <ScrollView>
                <RenderDish key={0} dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(elm => elm == dishId)}
                    onPress={() => this.markFavorite(dishId)}
                />
                        <Modal animationType={"slide"} transparent={false}
                            visible={this.state.showModal}
                            onDismiss={() => this.toggleModal()}
                            onRequestClose={() => this.toggleModal()}>
                            <View style={styles.modal}>

                                <Rating showRating fractions="{1}" startingValue="{3.3}" onFinishRating={(rating) => {this.setState({rating:rating})}} />

                                <Input
                                    reversed
                                    placeholder="author"
                                    leftIcon={{ type: 'font-awesome', name: 'user' }}
                                    style={styles}
                                    onChangeText={(value) => {this.setState({ author: value })}}
                                />

                            
                                <Input
                                    reversed
                                    placeholder="Comment"
                                    leftIcon={{ type: 'font-awesome', name: 'comment' }}
                                    style={styles}
                                    onChangeText={(value) => {this.setState({ comment: value })}}
                                />

                                <View style={styles.formRow}>
                                <Button
                                    onPress={() => { this.handleCommentSubmit(dishId); }}
                                    color="#512DA8"
                                    title="Submit"
                                    style={{marginBottom: 2, marginTop: 2}}
                                />
                                </View>
                                <View style={styles.formRow}>
                                <Button
                                    onPress={() => { this.toggleModal(); this.resetForm(); }}
                                    color="grey"
                                    title="Close"
                                    style={{marginBottom: 2, marginTop: 2}}
                                />
                                </View>
                            </View>
                        </Modal>                
                <RenderComments key={1} comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);