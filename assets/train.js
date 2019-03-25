$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "",
        authDomain: "traintracker-30b3f.firebaseapp.com",
        databaseURL: "https://traintracker-30b3f.firebaseio.com",
        projectId: "traintracker-30b3f",
        storageBucket: "traintracker-30b3f.appspot.com",
        messagingSenderId: "727264228065"
    };
    firebase.initializeApp(config);

    var database = firebase.database();
    var time = moment();

    function currentTime() {
        var currentTime = moment(time).format("hh:mm");
        $("#currentTime").text("Current Time: " + currentTime)

        console.log("CURRENT TIME: " + moment(time).format("hh:mm"))

    }

    currentTime();

    $("#submit").on("click", function (event) {
        event.preventDefault();

        var name = $("#addTrainName").val();
        var destination = $("#addDestination").val();
        var firstTrainTime = $("#addFirstTrainTime").val();
        var frequency = $("#addFrequency").val();


        var newTrain = {
            name: name,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,

        }

        database.ref().push(newTrain)

        alert(name + " has been added!")

        $("#addTrainName").val("");
        $("#addDestination").val(""),
            $("#addFirstTrainTime").val("");
        $("#addFrequency").val("");


    })

    database.ref().on("child_added", function (childSnapshot) {
        var firstTrainTimeConverted = moment(childSnapshot.val().firstTrainTime, "hh:mm").subtract(1, "years");

        var timeDiff = moment().diff(moment(firstTrainTimeConverted), "minutes");
        console.log("timediff:" + timeDiff)
        var remainderoftime = timeDiff % childSnapshot.val().frequency;
        console.log("remoftime:" + remainderoftime)
        var minTillArrival = childSnapshot.val().frequency - remainderoftime;
        console.log("min til arrival:" + minTillArrival)
        var nextTrain = moment().add(minTillArrival, "minutes");
        console.log(nextTrain)
        key = childSnapshot.key;

        var newrow = $("<tr>").append(
            $("<td>" + childSnapshot.val().name + "</td>"),
            $("<td>" + childSnapshot.val().destination + "</td>"),
            $("<td>" + childSnapshot.val().frequency + "</td>"),
            $("<td>" + moment(nextTrain).format("LT") + "</td>"),
            $("<td>" + minTillArrival + "</td>")
        );
        console.log(newrow);

        $(".table").append(newrow);
    });

    setInterval(function() {
        window.location.reload();
      }, 60000);
});
