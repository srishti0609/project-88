import React, { Component } from 'react';
import { View, StyleSheet, Text, TextInput,KeyboardAvoidingView,TouchableOpacity,Alert, ToastAndroid } from 'react-native';
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../components/MyHeader'

export default class Exchange extends Component{

  constructor(){
    super()
    this.state = {
      userName : firebase.auth().currentUser.email,
      itemName : "",
      description : "",
      IsRequestActive:"",
      exchangeId:"",
      docId:'',
      userDocId:'',
      currencyCode:"",
      itemValue:"",
      exchange_status:""
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }

  addItem=(itemName, description)=>{
    var userName = this.state.userName
    exchangeId = this.createUniqueId()
    db.collection("exchange_requests").add({
      "username"    : userName,
      "item_name"   : itemName,
      "description" : description,
      "exchangeId"  : exchangeId,
      "exchange_status":"asked for exchange",
      "item_value": this.state.itemValue,
      "date": firebase.firestore.FieldValue.serverTimestamp()
     })

     await this.getExchange()
     db.collection('users').where("email_id","==",userId).get()
     .then()
     .then((snapshot)=>{
       snapshot.forEach((doc)=>{
         db.collection('users').doc(doc.id).update({
           isRequestActive:true
         })
       })
         
       })
     
     
     this.setState({
       itemName : '',
       description :'',
       exchangeId:randomExchangeId

     })

   
     return Alert.alert(
          'Item ready to exchange',
          '',
          [
            {text: 'OK', onPress: () => {

              this.props.navigation.navigate('HomeScreen')
            }}
          ]
      );
  }

  receivedItem=(bookName)=>{
  var userId = this.state.userId
  var exchangeId = this.state.exchangeId
  db.collection('received_barters').add({
      "user_id": userId,
      "item":item,
      "exchange_id"  : exchangeId,
      "exchange_status"  : "done",

  })
}




getIsBarterActive(){
  db.collection('users')
  .where('email_id','==',this.state.userId)
  .onSnapshot(querySnapshot => {
    querySnapshot.forEach(doc => {
      this.setState({
        IsRequestActive:doc.data().IsRequestActive,
        userDocId : doc.id
      })
    })
  })
}

getExchange =()=>{
  
var ecvhange=  db.collection('all_barters')
  .where('user_id','==',this.state.userId)
  .get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      if(doc.data().exchange_status !== "done"){
        this.setState({
          requestId : doc.data().request_id,
          item: doc.data().item,
         
          docId     : doc.id
        })
      }
    })
})}



sendNotification=()=>{
  //to get the first name and last name
  db.collection('users').where('email_id','==',this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      var name = doc.data().first_name
      var lastName = doc.data().last_name

      // to get the donor id and book nam
      db.collection('all_notifications').where('request_id','==',this.state.requestId).get()
      .then((snapshot)=>{
        snapshot.forEach((doc) => {
          var ExchangerId  = doc.data().Exchanger_id
          var item =  doc.data().item

          //targert user id is the donor id to send notification to the user
          db.collection('all_notifications').add({
            "targeted_user_id" : donorId,
            "message" : name +" " + lastName + " received " + item ,
            "notification_status" : "unread",
            "item" : item
          })
        })
      })
    })
  })
}
getData(){
  fetch("http://data.fixer.io/api/latest?access_key=1f7dd48123a05ae588283b5e13fae944&format=1")
  .then(response=>{
    return responce.json();
  })
    .then(responceData=>{
     var currencyCode=this.state.currencyCode
     var currency =responceData.rates.INR
   var value=69/currency
  })
}
componentDidMount(){
  this.getRequest()
  this.getIsBarterActive()

}

updateBarterStatus=()=>{
  
  db.collection('all_barters').doc(this.state.docId)
  .update({
    book_status : 'recieved'
  })

  //getting the  doc id to update the users doc
  db.collection('users').where('email_id','==',this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc) => {
      //updating the doc
      db.collection('users').doc(doc.id).update({
        IsRequestActive: false
      })
    })
  })


}


  render(){
   
      if(this.state.IsRequestActive === true){
        return(
  
        
  
          <View style = {{flex:1,justifyContent:'center'}}>
            <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
            <Text>Item Name</Text>
            <Text>{this.state.item}</Text>
            </View>
            <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
            <Text> Barter Status </Text>
  
            <Text>{this.state.barter_status}</Text>
            </View>
            <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
            <Text>Item Value </Text>
  
            <Text>{this.state.itemValue}</Text>
            </View>
  
            <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
            onPress={()=>{
              this.sendNotification()
              this.updateBarterStatus();
              this.receivedItem(this.state.item)
            }}>
            <Text>I recieved the book </Text>
            </TouchableOpacity>
          </View>
        )
      }
      else{
        return(
      <View style={{flex:1}}>
      <MyHeader title="Add Item"/>
      <KeyboardAvoidingView style={{flex:1,justifyContent:'center', alignItems:'center'}}>
        <TextInput
          style={styles.formTextInput}
          placeholder ={"Item Name"}
          maxLength ={8}
          onChangeText={(text)=>{
            this.setState({
              itemName: text
            })
          }}
          value={this.state.itemName}
        />
        <TextInput
          multiline
          numberOfLines={4}
          style={[styles.formTextInput,{height:100}]}
          placeholder ={"Description"}
          onChangeText={(text)=>{
            this.setState({
              description: text
            })
          }}
          value={this.state.description}

        />
        <TextInput
        style={styles.formTextInput}
        placeholder={"Country currency code"}
        maxLength={8}
        onChangeText={(text)=>{
          this.setState({
            currencyCode:text
          })
        }}
        />
        <TouchableOpacity
          style={[styles.button,{marginTop:10}]}
          onPress = {()=>{this.addItem(this.state.itemName, this.state.description)}}
          >
          <Text style={{color:'#ffff', fontSize:18, fontWeight:'bold'}}>Add Item</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      </View>
    
        )}    

        }
      
  }
    
    


const styles = StyleSheet.create({
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },

})
