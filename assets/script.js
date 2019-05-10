var firebaseConfig = {
    apiKey: "AIzaSyBmCWPcmYVYMftVWC4A4e1EVNkQzyYJcBI",
    authDomain: "train-scheduler-b68e2.firebaseapp.com",
    databaseURL: "https://train-scheduler-b68e2.firebaseio.com",
    projectId: "train-scheduler-b68e2",
    storageBucket: "train-scheduler-b68e2.appspot.com",
    messagingSenderId: "354926861724",
    appId: "1:354926861724:web:8a27ba528f011616"
  };
  
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

var currentTime = moment();

//New train form submit function
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    var trainName = $("#train-input").val().trim();
    var destName = $("#destination-input").val().trim();
    var firstTrain = $("#first-input").val().trim();
    var trainFreq = $("#frequency-input").val().trim();
    
    // Creates temporary object for holding train data
    var newTrain = {
      name: trainName,
      dest: destName,
      start: firstTrain,
      freq: trainFreq
    }; 
    database.ref().push(newTrain);
//clearing form values
    $("#train-input").val("");
    $("#destination-input").val("");
    $("#first-input").val("");
    $("#frequency-input").val("");

});

//Grabbing info from Firebase
database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    
    var trainName = childSnapshot.val().name;
    var destName = childSnapshot.val().dest;
    var firstTrain = childSnapshot.val().start;
    var trainFreq = childSnapshot.val().freq;

    //Figuring out next train arrival time
    var firstTimeConverted = moment(firstTrain, 'HH:mm').subtract(1,'years');

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    var remainder = diffTime % trainFreq;

    var minsTilltrain = trainFreq - remainder;

    var nextTrain = moment().add(minsTilltrain, "minutes").format('llll');

    // Create Train Row on DOM
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(destName),
      $("<td>").text(trainFreq),
      $("<td>").text(nextTrain),
      $("<td>").text(minsTilltrain),
    );
    $("#train-schedule > tbody").append(newRow);
  });