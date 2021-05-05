import * as React from 'react';
import {View,Animated,Dimensions,StyleSheet,Text} from 'react-native';
import {ListItem,Icon} from 'react-native-elements';
import {SwipeListView} from 'react-native-swipe-list';
import db from '../config';
export default class SwipableFlatList extends Component{
    constructor(props){
        super(props);
        this.state={
            allNotifictions:this.props.allNotifications,
        };
    }
   
UpdateMarkAsread=(notification)=>{
    db.collection("all_notifications").doc(notification.doc_id).update({
        "notification_status":"read"
    })
}
onSwipeValueChange=swipeData=>{
    var allNotifications=this.state.allNotifications
    const {key,value}= swipeData;
    if(value<-Dimensions.get('window').width){
        const newData=[...allNotifications];
        const prevIndex=allNotifications.findIndex(item=>item.key===key);
        this.updateMarksAsread(allNotifications[prevIndex]);
        newData.slice(preIndex,1);
        this.setStat({allNotifications:newData})
    };
}

renderItem=data=>{
    <ListItem
    leftElement={<Icon name="item" type="font-awesome" color='#696969'/>}
    title={data.item.item}
    titleStyle={{color:'black', fontWeight:'bold'}}
    subtitle={data.item.message}
    bottomDivider
    />
}

renderHiddenItem=()=>{
    <View style={StyleSheet.rowBack}>
        <Text style={StyleSheet.backText}>

        </Text>
    </View>
}
render(){
    return(
        <View>
            disableRightSwipe
            data={this.state.allNotifications}
            renderItem={this.renderItem}
            renderHiddenItem={this.renderHiddenItem}
            rightOpenValue={-Dimensions.get('window').width}
            previewRowKey={'0'}
            previewOpenValue={-40}
            previewOpenDelay={3000}
            onSwipeValueChange={this.onSwipeValueChange}
        </View>
    )
}
}