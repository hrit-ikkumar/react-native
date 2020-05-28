import React, {Component} from 'react'
import {Text, ScrollView, StyleSheet, Picker, Switch, Button, View, Modal, Alert} from 'react-native'
import {Card} from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import * as Animated from 'react-native-animatable';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions'
import * as Calendar from 'expo-calendar';
// imported all the pkgs as *
class Reservation extends Component
{
    constructor(props)
    {
        super(props);

        this.state = 
        {
            guest :1,
            smoking : false,
            date : '',
        }
    }

    static navigationOptions =
    {
        title : 'Reserve Table'
    }

    handleReservation()
    {
        Alert.alert(
            'Your Reservation OK',
            'Number of Guests : ' + this.state.guest + 
            '\nSmoking? : '       + this.state.smoking +  
            '\nDate and Time : '  + this.state.date,
            [
                {
                    text : 'CANCEL',
                    onPress : () => {this.resetForm()},
                    style : 'cancel'
                },
                
                {
                    text : 'OK',
                    onPress : () => { this.presentLocalNotification(this.state.date); this.addReservationToCalendar(this.state.date); this.resetForm()},
                    style : 'ok'
                }  
            ],
            {cancelable:false}
        ) 
    }

    async obtainCalendarPermission()
    {
        let permission = await Calendar.requestCalendarPermissionsAsync(Permissions.CALENDAR);
        if (permission.status !== 'granted') {
            Alert.alert('Permission not granted to show notifications');
        }

        return permission;
    
    }

    async addReservationToCalendar(date)
    {
        await this.obtainCalendarPermission();
        Calendar.createEventAsync(Calendar.DEFAULT,
        {
            title: 'Restorante con fusion',
            startDate : new Date(Date.parse(date)),
            endDate : new Date(Date.parse(date)) + (2*60*60*1000) ,
            timeZone : 'Asia/Hong_Kong',
            location : '121 Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
        });
        }


    resetForm()
    {
        this.setState({
            guest :1,
            smoking : false,
            date : '',
        })
    }

    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
        }
        return permission;
    }

    async presentLocalNotification(date) {
        await this.obtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({
            title: 'Your Reservation',
            body: 'Reservation for '+ date + ' requested',
            priority: "high",
            show_in_foreground: true,
            local: true,
            ios: {
                sound: true
            },
            android: {
                sound: true,
                vibrate: true,
                color: '#512DA8'
            }
        });
    }

    render()
    {
        return(
            <ScrollView>
                <Animated.View animation='zoomIn' useNativeDriver='true' delay={0} duration={2000}>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}> Number of Guests </Text>
                        <Picker style={styles.formItem}
                                selectedValue={this.state.guest}
                                onValueChange={(itemValue,itemIndex) => this.setState({guest : itemValue})}
                        >
                            <Picker.Item label='1' value='1' />
                            <Picker.Item label='2' value='2' />
                            <Picker.Item label='3' value='3' />
                            <Picker.Item label='4' value='4' />
                            <Picker.Item label='5' value='5' />
                            <Picker.Item label='6' value='6' />

                        </Picker>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}> Smoking/Non-Smoking? </Text>
                        <Switch style={styles.formItem}
                                value={this.state.smoking}
                                onTintColor="#512DA8"
                                onValueChange={(value) => this.setState({smoking : value})}
                        >

                        </Switch>
                    </View> 
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}> Date and Time </Text>
                        <DatePicker style = {{flex:2,marginRight : 20}}
                                    date = {this.state.date}
                                    format = ''
                                    mode = 'datetime'
                                    placeholder = 'select date and time'
                                    minDate='2020-01-01'
                                    cancelBtnText = 'Cancel'
                                    customStyles={{
                                        dateIcon : {
                                            position: 'absolute',
                                            left : 0,
                                            top :4,
                                            marginLeft : 0
                                        },
                                        dateInput : {
                                            marginLeft : 40
                                        }
                                    }}
                                    onDateChange = {(date) => {this.setState({date : date})}}
                        />    
                    </View> 
                    <View style={styles.formRow}>
                        <Button title="Reserve"
                                color = '#512DA8'
                                onPress = {() => this.handleReservation()}
                                accessibilityLabel = 'Learn more about this purple button'
                        />
                    </View>
                </Animated.View>
            </ScrollView>


        )
    }
}

const styles = StyleSheet.create({
    formRow :{
        alignItems : 'center',
        justifyContent : 'center',
        flex : 1,
        flexDirection :'row',
        margin : 20
    },
    formLabel : {
        fontSize : 18,
        flex : 2,
    },
    formItem : {
        flex : 1
    },
    modal :{
        justifyContent : 'center',
        margin : 20
    },
    modalTitle :
    {
        fontSize : 24,
        fontWeight : 'bold',
        backgroundColor : '#512DA8',
        textAlign : 'center',
        color : 'white',
        marginBottom : 20
    },
    modalText: {
        fontSize  :18,
        margin : 10
    }

})
export default Reservation;