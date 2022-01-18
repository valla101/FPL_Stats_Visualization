// remove fragment as much as it can go without adding an entry in browser history:
// ALLOWS FUNCTIONALITY OF "BACK TO TOP" BUTTON
window.location.replace("#");

// slice off the remaining '#' in HTML5:    
if (typeof window.history.replaceState == 'function') {
  history.replaceState({}, '', window.location.href.slice(0, -1));
}


// styling for chartjs container. get elements by class name returns an arrray of items
var getChartjsContainer = document.getElementsByClassName("container-chart");

// getChartjsContainer returns an HTMLDocument array. you are unable to use a foreach function. must convert that list into an array
Array.from(getChartjsContainer).forEach(
  function(item){
    // sets container height to auto. when first loading page, the height needs to be resized to look cleaner
    item.style["height"] = "auto";
  }
);

// FUNCTIONAL BAR GRAPH Filtering stats in descending order
// Produces the Bar Graph based on Stat Selected
function interactivePlot(stat){
  var ctx = document.getElementById('statBarGraph').getContext('2d');

  // using d3 to extract property "value" and insert into url for api call
  var statsDropdown = d3.select(statsList);
  var stat = statsDropdown.property("value");

  // use this string to query the database through flask route
  var url2 = `${stat}/${10}`

  // function that reads, maps data from api call
  d3.json(url2).then(function(data) {

    var cleanStat = document.getElementById("statsList");
    // This variable is to obtain the text from dropdown menu statsList2
    var cleanStatText = cleanStat.options[cleanStat.selectedIndex].text;
  
      // console.log(data);
  
      var PlayerName = data.map(Player => Player["player"]);
      var statQueried = data.map(Player => Player[stat]);
      
      var dataCleanFormat = []
      for(var i=0;i<data.length;i++)
      {
      // var obj = {y:statQueried[i]};
      dataCleanFormat.push(statQueried[i]);
      }
  
      console.log(dataCleanFormat);

      var playerNameCleanFormat = []
      for(var i=0;i<data.length;i++)
      {
      // var obj = {label: PlayerName[i]};
      playerNameCleanFormat.push(PlayerName[i]);
      }

      console.log(playerNameCleanFormat);

  
      var chartData = {
        labels: playerNameCleanFormat,
        datasets: [{
          axis: 'y', 
          label: cleanStatText,
          data: dataCleanFormat,
          backgroundColor: 'red'
        }]
      }
  
      var myChart = new Chart(ctx, {
        type: 'bar',
        labels: playerNameCleanFormat,
        data: chartData,
        options: {
          // retains ratio of chart. otherwise it will be too big for a computer screen
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              ticks: {
                fontSize: 15,
                fontStyle: "bold",
                beginAtZero: true,
              }
            }],
            xAxes: [{
              ticks: {
                fontSize: 20,
                fontStyle: "bold",
              }
            }]
        },
          title: {
            display: true,
            text: `2021/2022 Premier League Top Performers: ${cleanStatText}`,
            fontSize: 20,
            fontColor: 'black',
          }
        },
        
      });

          // Function gets rid of ChartJS bug when floating over chart
      var scatterPlotButton = document.getElementById("statsList");;
      scatterPlotButton.addEventListener("click", function () {
      // This action destroys the previous chart requested by player
      myChart.destroy();
      });
    });


// // START of Resize Container (aesthetic purposes) Function Scope
  var resizeFunc = function() {
  // console.log("this")

  var getTopPerformersButton = document.getElementById("statsList");
   
  getTopPerformersButton.addEventListener("click", function(){
    // console.log("this again")

    var getTopPerformersContainer = document.getElementById("stats-top-performers-chartjs-container");
    
    // sets container height to 75vh only after get stats button is clicked. resizes the container for a larger chart
    getTopPerformersContainer.style["height"] = "75vh";});
  // END OF testFunc Scope
  };
// calling testFunc
resizeFunc()

};
  

stats = d3.select("#statsList")

stats.on("change", interactivePlot)


// Function to query sql database based on user input for player value
// Successfully returns all the records that are =< value inserted 

function filterByPrice(){

  var button = document.getElementById("priceFilterButton");

  button.addEventListener("click", function formValidate() {

    var formValue = document.getElementById("priceFilter").value;
  
    // console.log(formValue);  

    var test_url = `/query_by_value/${formValue}`;

      d3.json(test_url).then(function(data){
      console.table(data);
      var table = new Tabulator("#playerDataTable", {
      data:data, //assign data to table
      // autoColumns:true, //create columns from data field names
      height: "500px",
      layout: "fitDataStretch",
      columns:[
        {title: "Player", field: "player", frozen: true},
        {title: "Team", field: "team_id"},
        {title: "Nationality", field: "nation"},
        {title: "Position", field: "player_position"},
        {title: "Age", field: "age"},
        {title: "FPL Value", field: "current_price"},
        {title: "FPL Points", field: "total_points"},
        {title: "FPL Points/FPL Value", field: "value_season"},
        {title: "Selected By (%)", field: "selected_by_percent"},
        {title: "Transferred In (This Week)", field: "transfers_in"},
        {title: "Minutes Played", field: "minutes"},
        {title: "Games Played", field: "games_played"},
        {title: "Games Started", field: "starts"},
        {title: "Goals", field: "goals"},
        {title: "Assists", field: "assists"},
        {title: "Shots Attempted", field: "total_shots"},
        {title: "Shots on Target", field: "shots_on_target"},
        {title: "Shots on Target Percentage", field: "shots_on_target_percentage"},
        {title: "Total Shots per 90", field: "total_shots_per_90"},
        {title: "Shots on Target per 90", field: "shots_on_target_per_90"},
        {title: "Average Shot Distance (Yards)", field: "average_shot_distance"},
        {title: "Free Kicks Attempted", field: "free_kick_shots"},
        {title: "PKs Scored", field: "pk_scored"},
        {title: "PKs Attempted", field: "pk_attempts"},
        {title: "Expected Goals", field: "expected_goals"},
        {title: "Non Penalty xG", field: "non_penalty_expected_goals"},
        {title: "Expected Assists", field: "expected_assists"},
        {title: "Expected Goals per 90", field: "expected_goals_per_90"},
        {title: "Expected Assists per 90", field: "expected_assists_per_90"},
        {title: "xG + xA per 90", field: "expected_goals_plus_expected_assists_per_90"},
        {title: "Non Penalty xG + xA per 90", field: "non_penalty_expected_goals_plus_expected_assists_per_90"},
        {title: "Non Penalty xG per 90", field: "non_penalty_expected_goals_per_90"},
        {title: "Goals Per 90", field: "goals_per_90"},
        {title: "Goals - PK Per 90", field: "goals_minus_penalty_kicks_per_90"},
        {title: "Assists Per 90", field: "assists_per_90"},
        {title: "G + A Per 90", field: "goals_plus_assists_per_90"},
        {title: "G + A  - PK Per 90", field: "goals_plus_assists_minus_penalty_kicks_per_90"},
        {title: "Yellow Cards", field: "yellow_cards"},
        {title: "Red Cards", field: "red_cards"},         
      ]
  });
    });
  });

};
var priceButton = document.getElementById("priceFilterButton")
priceButton.addEventListener("change", filterByPrice())
// Function to Filter Table by Position

var positionFilterButton = document.getElementById("positionButton");

positionFilterButton.addEventListener("click", function(){
  // console.log("it worked");

  var position = d3.select(queryPosition);

  var positionValue = position.property("value");

  var url2 = `/query_by_position/${positionValue}`
  d3.json(url2).then(function(data){
    // console.log(data)
    var table = new Tabulator("#playerDataTable", {
      data:data, //assign data to table
      // autoColumns:true, //create columns from data field names
      height: "500px",
      layout: "fitDataStretch",
      columns:[
        {title: "Player", field: "player", frozen: true},
        {title: "Team", field: "team_id"},
        {title: "Nationality", field: "nation"},
        {title: "Position", field: "player_position"},
        {title: "Age", field: "age"},
        {title: "FPL Value", field: "current_price"},
        {title: "FPL Points", field: "total_points"},
        {title: "FPL Points/FPL Value", field: "value_season"},
        {title: "Selected By (%)", field: "selected_by_percent"},
        {title: "Transferred In (This Week)", field: "transfers_in"},
        {title: "Minutes Played", field: "minutes"},
        {title: "Games Played", field: "games_played"},
        {title: "Games Started", field: "starts"},
        {title: "Goals", field: "goals"},
        {title: "Assists", field: "assists"},
        {title: "Shots Attempted", field: "total_shots"},
        {title: "Shots on Target", field: "shots_on_target"},
        {title: "Shots on Target Percentage", field: "shots_on_target_percentage"},
        {title: "Total Shots per 90", field: "total_shots_per_90"},
        {title: "Shots on Target per 90", field: "shots_on_target_per_90"},
        {title: "Average Shot Distance (Yards)", field: "average_shot_distance"},
        {title: "Free Kicks Attempted", field: "free_kick_shots"},
        {title: "PKs Scored", field: "pk_scored"},
        {title: "PKs Attempted", field: "pk_attempts"},
        {title: "Expected Goals", field: "expected_goals"},
        {title: "Non Penalty xG", field: "non_penalty_expected_goals"},
        {title: "Expected Assists", field: "expected_assists"},
        {title: "Expected Goals per 90", field: "expected_goals_per_90"},
        {title: "Expected Assists per 90", field: "expected_assists_per_90"},
        {title: "xG + xA per 90", field: "expected_goals_plus_expected_assists_per_90"},
        {title: "Non Penalty xG + xA per 90", field: "non_penalty_expected_goals_plus_expected_assists_per_90"},
        {title: "Non Penalty xG per 90", field: "non_penalty_expected_goals_per_90"},
        {title: "Goals Per 90", field: "goals_per_90"},
        {title: "Goals - PK Per 90", field: "goals_minus_penalty_kicks_per_90"},
        {title: "Assists Per 90", field: "assists_per_90"},
        {title: "G + A Per 90", field: "goals_plus_assists_per_90"},
        {title: "G + A  - PK Per 90", field: "goals_plus_assists_minus_penalty_kicks_per_90"},
        {title: "Yellow Cards", field: "yellow_cards"},
        {title: "Red Cards", field: "red_cards"},         
      ]
  });
  })
}
);

              // NEW CHART
        // PLAYER STATS BAR GRAPH
// Route for Player Offensive Stats. Generates a Bar Graph
function filterByPlayer(){

  var ctx = document.getElementById('playerBarChart').getContext('2d');
// get button from Player Stats Table
  var getPlayerStatsButton = document.getElementById("getPlayerStatsButton");

  // Initialize function on click (button)
  getPlayerStatsButton.addEventListener("click", function playerSelected() {

    // var playerDropdown = d3.select("#playerName");
    var player = document.getElementById("playerName").value;
    var test_url = `/query_all_players/${player}`;
    d3.json(test_url).then(function(data){
      // console.log(data);

      var PlayerName = data.map(Player => Player["player"]);
      var totalPoints = data.map(Player => Player["total_points"]);
      var totalGoals = data.map(Player => Player["goals"]);
      var totalAssists = data.map(Player => Player["assists"]);
      var xGoals = data.map(Player => Player["expected_goals"]);
      var xAssists = data.map(Player => Player["expected_assists"]);
      var playerPosition1 = data.map(Player => Player["player_position"]);

      // Player 1 Shooting Stats
      var shotsAttempted = data.map(Player => Player["total_shots"]);
      var shotsOnTarget = data.map(Player => Player["shots_on_target"]);
      var shotsOnTargetPercentage = data.map(Player => Player["shots_on_target_percentage"]);
      var shotsPer90 = data.map(Player => Player["total_shots_per_90"]);
      var shotsonTargetPer90 = data.map(Player => Player["shots_on_target_per_90"]);
      var averageShotDistance = data.map(Player => Player["average_shot_distance"]);
      var FKAttempted = data.map(Player => Player["free_kick_shots"]);
      

      // Player 1 GK Stats
      var cleanSheet = data.map(Player => Player["clean_sheets"]);
      var cleanSheetPercentage = data.map(Player => Player["clean_sheet_percentage"]);
      var goalsConceded = data.map(Player => Player["goals_against"]);
      var goalsConcededPerMatch = data.map(Player => Player["goals_against_per_90"]);
      var pkAttemptAgainst = data.map(Player => Player["pk_attempts_against"]);
      var pkSaved = data.map(Player => Player["penalty_kicks_saved"]);
      var pkScoredOn = data.map(Player => Player["penalty_kicks_scored_on"]);
      var pkMissedAgainst = data.map(Player => Player["penalty_kicks_missed"]);
      var gkSaves = data.map(Player => Player["saves"]);
      var gkSavePercentage = data.map(Player => Player["save_percentage"]);
      var gkShotsOnTargetAgainst = data.map(Player => Player["shots_on_target_against"]);

      // Populate Stats for all Players that ARE NOT Goalkeepers
      if(playerPosition1 != "Goalkeeper"){
        var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: ['Total Points', 'Total Goals Scored', 'Expected Goals', 'Total Assists', 'Expected Assists', 'Shots Attempted', "Shots on Target", "Shots on Target %", "Shots per 90", "Shots on Target per 90", "Average Shot Distance (Yards)", "Free Kicks Attempted"],
              datasets: [{
                  label: PlayerName,
                  data: [parseInt(totalPoints), parseInt(totalGoals), parseFloat(xGoals), parseInt(totalAssists), parseFloat(xAssists), parseInt(shotsAttempted), parseInt(shotsOnTarget), parseFloat(shotsOnTargetPercentage), parseFloat(shotsPer90), parseFloat(shotsonTargetPer90), parseFloat(averageShotDistance), parseInt(FKAttempted)],
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.6)',
                      'rgba(54, 162, 235, 0.6)',
                      'rgba(255, 206, 86, 0.6)',
                      'rgba(75, 192, 192, 0.6)',
                      'rgba(153, 102, 255, 0.6)',
                      'rgba(255, 159, 64, 0.6)',
                      'rgba(236, 149, 24, 0.6)',
                      'rgba(217, 139, 64, 0.6)',
                      'rgba(195, 129, 64, 0.6)',
                      'rgba(175, 119, 200, 0.6)',
                      'rgba(155, 109, 64, 0.6)',
                      'rgba(135, 99, 64, 0.6)',
                      'rgba(255, 89, 64, 0.6)'
                  ],
                  borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)',
                      'rgba(255, 159, 64, 1)',
                      'rgba(255, 159, 64, 1)',
                      'rgba(255, 159, 64, 1)',
                      'rgba(255, 159, 64, 1)',
                      'rgba(255, 159, 64, 1)',
                      'rgba(255, 159, 64, 1)'
                  ],
                  borderWidth: 1
              }]
          },
          options: {
            responsive: true,
            // allows for resizing of container manually
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                  ticks: {
                    fontSize: 15,
                    fontStyle: "bold"
                  }
                }],
                xAxes: [{
                  ticks: {
                    fontSize: 20,
                    fontStyle: "bold"
                  }
                }]
            },
            
            plugins: {
              legend: {

                labels:{
                  fontSize: 20,
                }
              }},
            
            title: {display: true,
              text: `2021/2022 Premier League Stats: ${PlayerName}`,
              fontSize: 20,
              fontColor: 'black',}
          }
        });
         // Function gets rid of ChartJS bug when floating over chart
        var getPlayerStatsButton = document.getElementById("getPlayerStatsButton");
        getPlayerStatsButton.addEventListener("click", function(){
        // This action destroys the previous chart requested by player
        myChart.destroy();


        });
      }

      // Populate Stats for all Players that ARE Goalkeepers
      else{
        var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total Points', 'Total Saves', 'Save Percentage', 'Shots on Target Against', 'Clean Sheets', "Goals Conceded", "Goals Conceded Per 90", "Penalty Kicks Attempted Against", "Saved Penalty Kicks", "Penalty Kicks Scored Against", "Penalty Kicks Missed Against"],
            datasets: [{
                label: PlayerName,
                data: [parseInt(totalPoints), parseInt(gkSaves), parseFloat(gkSavePercentage), parseInt(gkShotsOnTargetAgainst), parseInt(cleanSheet), parseInt(goalsConceded), parseFloat(goalsConcededPerMatch), parseInt(pkAttemptAgainst), parseInt(pkSaved), parseInt(pkScoredOn), parseInt(pkMissedAgainst)],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 159, 64, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
        // allows for resizing of container manually 
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
              ticks: {
                fontSize: 15,
                fontStyle: "bold"
              }
            }],
            xAxes: [{
              ticks: {
                fontSize: 20,
                fontStyle: "bold"
              }
            }]
        },
          title: {display: true,
            text: `2021/2022 Premier League Stats: ${PlayerName}`,
            fontSize: 20,
            fontColor: 'black',}
        }
        });

       // Function gets rid of ChartJS bug when floating over chart
        var getPlayerStatsButton = document.getElementById("getPlayerStatsButton");
        getPlayerStatsButton.addEventListener("click", function(){
        // This action destroys the previous chart requested by player
        myChart.destroy();
        });
      }

  // END OF JSON Call Function Scope
  });

 

})

// START of Resize Container (aesthetic purposes) Function Scope
      var resizeFunc = function() {
        // console.log("this")
    
        var getPlayerStatsButton = document.getElementById("getPlayerStatsButton");
         
        getPlayerStatsButton.addEventListener("click", function(){
          // console.log("this again")

          var getPlayerStatsContainer = document.getElementById("player_stat_chartjs_container");
          
          // sets container height to 75vh only after get stats button is clicked. resizes the container for a larger chart
          getPlayerStatsContainer.style["height"] = "75vh";
    
        });
        // END OF testFunc Scope
      };
      // calling testFunc
      resizeFunc()

// ABOVE END OF GET PLAYER STATS FUNCTION SCOPE
};


var getPlayerStatsButton = document.getElementById("getPlayerStatsButton");
getPlayerStatsButton.addEventListener("change", filterByPlayer())

                // NEW GRAPH TO COMPARE PLAYERS

// Compare Players Bar Graph

// Graphing Function to compare offensive stats of 2 players
function comparePlayers(){
  var ctx = document.getElementById('comparePlayerGraph').getContext('2d');

  var buttonPlayer2 = document.getElementById("comparePlayersButton");

  buttonPlayer2.addEventListener("click", function playersSelected() {

    // var playerDropdown = d3.select("#playerName");
    var player1 = document.getElementById("comparePlayer1").value;
    var player2 = document.getElementById("comparePlayer2").value;
    var test_url = `/query_all_players/${player1}/${player2}`;
    d3.json(test_url).then(function(data){
      // console.log(data[0]);
      // console.log(data[1]);

      // Compare Player 1
      var PlayerName1 = data[0].map(Player => Player["player"]);
      var totalPoints1 = data[0].map(Player => Player["total_points"]);
      var total_minutes_1 = data[0].map(Player => Player["minutes"]);
      var totalGoals1 = data[0].map(Player => Player["goals"]);
      var totalAssists1 = data[0].map(Player => Player["assists"]);
      var totalG_plus_A_per90_1 = data[0].map(Player => Player["goals_plus_assists_per_90"]);
      var xGoals1 = data[0].map(Player => Player["expected_goals"]);
      var xAssists1 = data[0].map(Player => Player["expected_assists"]);
      var playerPosition1 = data[0].map(Player => Player["player_position"]);
      // Player 1 Shooting Stats
      var shotsAttempted1 = data[0].map(Player => Player["total_shots"]);
      var shotsOnTarget1 = data[0].map(Player => Player["shots_on_target"]);
      var shotsOnTargetPercentage1 = data[0].map(Player => Player["shots_on_target_percentage"]);
      var shotsPer901 = data[0].map(Player => Player["total_shots_per_90"]);
      var shotsonTargetPer901 = data[0].map(Player => Player["shots_on_target_per_90"]);
      var averageShotDistance1 = data[0].map(Player => Player["average_shot_distance"]);
      var FKAttempted1 = data[0].map(Player => Player["free_kick_shots"]);
      // Player 1 GK Stats
      var cleanSheet1 = data[0].map(Player => Player["clean_sheets"]);
      var cleanSheetPercentage1 = data[0].map(Player => Player["clean_sheet_percentage"]);
      var goalsConceded1 = data[0].map(Player => Player["goals_against"]);
      var goalsConcededPerMatch1 = data[0].map(Player => Player["goals_against_per_90"]);
      var pkAttemptAgainst1 = data[0].map(Player => Player["pk_attempts_against"]);
      var pkSaved1 = data[0].map(Player => Player["penalty_kicks_saved"]);
      var pkScoredOn1 = data[0].map(Player => Player["penalty_kicks_scored_on"]);
      var pkMissedAgainst1 = data[0].map(Player => Player["penalty_kicks_missed"]);
      var gkSaves1 = data[0].map(Player => Player["saves"]);
      var gkSavePercentage1 = data[0].map(Player => Player["save_percentage"]);
      var gkShotsOnTargetAgainst1 = data[0].map(Player => Player["shots_on_target_against"]);
    


      // Compare Player 2
      var PlayerName2 = data[1].map(Player => Player["player"]);
      var totalPoints2 = data[1].map(Player => Player["total_points"]);
      var total_minutes_2 = data[0].map(Player => Player["minutes"]);
      var totalGoals2 = data[1].map(Player => Player["goals"]);
      var totalAssists2 = data[1].map(Player => Player["assists"]);
      var totalG_plus_A_per90_2 = data[1].map(Player => Player["goals_plus_assists_per_90"]);
      var xGoals2 = data[1].map(Player => Player["expected_goals"]);
      var xAssists2 = data[1].map(Player => Player["expected_assists"]);
      var playerPosition2 = data[1].map(Player => Player["player_position"]);
      // Player 2 Shooting Stats
      var shotsAttempted2 = data[1].map(Player => Player["total_shots"]);
      var shotsOnTarget2 = data[1].map(Player => Player["shots_on_target"]);
      var shotsOnTargetPercentage2 = data[1].map(Player => Player["shots_on_target_percentage"]);
      var shotsPer902 = data[1].map(Player => Player["total_shots_per_90"]);
      var shotsonTargetPer902 = data[1].map(Player => Player["shots_on_target_per_90"]);
      var averageShotDistance2 = data[1].map(Player => Player["average_shot_distance"]);
      var FKAttempted2 = data[1].map(Player => Player["free_kick_shots"]);
      // Player 2 GK Stats
      var cleanSheet2 = data[1].map(Player => Player["clean_sheets"]);
      var cleanSheetPercentage2 = data[0].map(Player => Player["clean_sheet_percentage"]);
      var goalsConceded2 = data[1].map(Player => Player["goals_against"]);
      var goalsConcededPerMatch2 = data[1].map(Player => Player["goals_against_per_90"]);
      var pkAttemptAgainst2 = data[1].map(Player => Player["pk_attempts_against"]);
      var pkSaved2 = data[1].map(Player => Player["penalty_kicks_saved"]);
      var pkScoredOn2 = data[1].map(Player => Player["penalty_kicks_scored_on"]);
      var pkMissedAgainst2 = data[1].map(Player => Player["penalty_kicks_missed"]);
      var gkSaves2 = data[1].map(Player => Player["saves"]);
      var gkSavePercentage2 = data[1].map(Player => Player["save_percentage"]);
      var gkShotsOnTargetAgainst2 = data[1].map(Player => Player["shots_on_target_against"]);

      if (playerPosition1 != "Goalkeeper" && playerPosition2 != "Goalkeeper") {
        var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Total Points', 'Total Goals Scored', 'Expected Goals', 'Total Assists', 'Expected Assists', 'Shots Attempted', "Shots on Target", "Shots on Target %", "Shots per 90", "Shots on Target per 90", "Average Shot Distance (Yards)", "Free Kicks Attempted"],
            datasets: [{
                label: PlayerName1,
                data: [parseInt(totalPoints1), parseInt(totalGoals1), parseFloat(xGoals1), parseInt(totalAssists1), parseFloat(xAssists1), parseInt(shotsAttempted1), parseInt(shotsOnTarget1), parseFloat(shotsOnTargetPercentage1), parseFloat(shotsPer901), parseFloat(shotsonTargetPer901), parseFloat(averageShotDistance1), parseInt(FKAttempted1)],
                backgroundColor: 'red',
                borderColor: 'red',
                borderWidth: 1
              },
              // Player Name 2
              {
                label: PlayerName2,
                data: [parseInt(totalPoints2), parseInt(totalGoals2), parseFloat(xGoals2), parseInt(totalAssists2), parseFloat(xAssists2), parseInt(shotsAttempted2), parseInt(shotsOnTarget2), parseFloat(shotsOnTargetPercentage2), parseFloat(shotsPer902), parseFloat(shotsonTargetPer902), parseFloat(averageShotDistance2), parseInt(FKAttempted2)],
                borderColor: 'blue',
                backgroundColor: 'blue',
                borderWidth: 1
              }
            ]
          },
          options: {
            // allows for resizing of container manually
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                  ticks: {
                    fontSize: 15,
                    fontStyle: "bold"
                  }
                }],
                xAxes: [{
                  ticks: {
                    fontSize: 20,
                    fontStyle: "bold"
                  }
                }]
            },

            plugins: {
              legend: {

                labels: {
                  fontSize: 20,
                }
              }
            },

            title: {
              display: true,
              text: `2021/2022 Premier League Stats: ${PlayerName1} vs ${PlayerName2}`,
              fontSize: 20,
              fontColor: 'black',
            }
          }
        });
        // Function gets rid of ChartJS bug when floating over chart
        var playerComparedFinalButton = document.getElementById("comparePlayersButton");
        playerComparedFinalButton.addEventListener("click", function () {
          // This action destroys the previous chart requested by player
          myChart.destroy();
        });
      }

      // Conditional Statement when comparing 1 defender (*MUST ADD CLEAN SHEET TO STATS IN THE DATABASE. ONLY GOALKEEPERS HAVE IT NOW*)=

      // Conditional Statement to compare 2 Goalkeepers
      if(playerPosition1 == "Goalkeeper" && playerPosition2 == "Goalkeeper"){
        var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Total Points', 'Total Saves', 'Save Percentage', 'Shots on Target Against', 'Clean Sheets', "Goals Conceded", "Goals Conceded Per 90", "Penalty Kicks Attempted Against", "Saved Penalty Kicks", "Penalty Kicks Scored Against", "Penalty Kicks Missed Against"],
            datasets: [{
                  label: PlayerName1,
                  data: [parseInt(totalPoints1), parseInt(gkSaves1), parseFloat(gkSavePercentage1), parseInt(gkShotsOnTargetAgainst1), parseInt(cleanSheet1), parseInt(goalsConceded1), parseFloat(goalsConcededPerMatch1), parseInt(pkAttemptAgainst1), parseInt(pkSaved1), parseInt(pkScoredOn1), parseInt(pkMissedAgainst1)],
                  backgroundColor: 'red',
                  borderColor: 'red',
                  borderWidth: 1
              },
            // Player Name 2
            {
                  label: PlayerName2,
                  data: [parseInt(totalPoints2), parseInt(gkSaves2), parseFloat(gkSavePercentage2), parseInt(gkShotsOnTargetAgainst2), parseInt(cleanSheet2), parseInt(goalsConceded2), parseFloat(goalsConcededPerMatch2), parseInt(pkAttemptAgainst2), parseInt(pkSaved2), parseInt(pkScoredOn2), parseInt(pkMissedAgainst2)],
                  borderColor: 'blue',
                  backgroundColor: 'blue',
                  borderWidth: 1
              }]
          },
          options: {
            // allows for resizing of container manually
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                  ticks: {
                    fontSize: 15,
                    fontStyle: "bold"
                  }
                }],
                xAxes: [{
                  ticks: {
                    fontSize: 20,
                    fontStyle: "bold"
                  }
                }]
            },
          
          plugins: {
            legend: {

              labels:{
                fontSize: 20,
              }
            }},
          
          title: {display: true,
            text: `2021/2022 Premier League Stats: ${PlayerName1} vs ${PlayerName2}`,
            fontSize: 20,
            fontColor: 'black',}
      }
        });
         // Function gets rid of ChartJS bug when floating over chart
        var playerComparedFinalButton = document.getElementById("comparePlayersButton");
        playerComparedFinalButton.addEventListener("click", function(){
        // This action destroys the previous chart requested by player
        myChart.destroy();
        });
      }
      
      if(playerPosition1 != "Goalkeeper" && playerPosition2 == "Goalkeeper"){
        window.alert("Cannot Compare Outfield Players to Goalkeepers");
      }

      if(playerPosition1 == "Goalkeeper" && playerPosition2 != "Goalkeeper"){
        window.alert("Cannot Compare Outfield Players to Goalkeepers");
      }
  });
// END OF JSON CALL FUNCTION
});

// START of Resize Container (aesthetic purposes) Function Scope
      var resizeFunc = function() {
        // console.log("this")
    
        var getPlayerStatsButton = document.getElementById("comparePlayersButton");
         
        getPlayerStatsButton.addEventListener("click", function(){
          // console.log("this again")

          var getPlayerStatsContainer = document.getElementById("compare_player_chartjs_container");
          
          // sets container height to 75vh only after get stats button is clicked. resizes the container for a larger chart
          getPlayerStatsContainer.style["height"] = "75vh";
    
        });
        // END OF testFunc Scope
      };
      // calling testFunc
      resizeFunc()
// END OF COMPARE PLAYERS FUNCTION
};

var playerComparedFinalButton = document.getElementById("comparePlayersButton");
playerComparedFinalButton.addEventListener("change", comparePlayers());

// Select 2 Function to add search filter to select button

$(document).ready(function() {
  // ID for Player Stats
  $('#playerName').select2();

  // ID for Player Comparison Stats
  $('#comparePlayer1').select2();
  $('#comparePlayer2').select2();
  $('#playerNameScatter').select2();

  // ID for Player Form Comparison Stats
  $('#player_select1').select2();
  $('#player_select2').select2();
  
});

// -----------------new Function------------------------
// New Function to Create Scatter Plot
function player_scatter(){
  var ctx = document.getElementById('scatter_plot').getContext('2d');

  var scatterPlotButton = document.getElementById("scatterButton");
  scatterPlotButton.addEventListener("click", function scatter(){
    
  var statsDropdown = d3.select(statsList2);
  var stat = statsDropdown.property("value");

  url = `query_all_player_stat/${stat}`;
  d3.json(url).then(function(data){

    var minutes = data.map(Player => Player["minutes"]);
    var statQueried = data.map(Player => Player[stat]);
    var playerName = data.map(Player => Player["player"]);

    var cleanStat = document.getElementById("statsList2");
    // This variable is to obtain the text from dropdown menu statsList2
    var cleanStatText = cleanStat.options[cleanStat.selectedIndex].text;

    // appends last season's stats based on price and position into a new list
    var dataCleanFormat = []

    // for loop the data that is collected using the api call & url
    for(var i=0;i<data.length;i++)
    {
    // obj is the object that will contain x, y categories and label
    var obj = {x:minutes[i],y:statQueried[i], label: playerName[i]};

    dataCleanFormat.push(obj);
    }

    // console.log(dataCleanFormat);

    // this variable will be used to push the contents of dataCleanFormat into the Chartjs format
    var chartData = {
      datasets: [{
        label: [],
        data: [],
        backgroundColor: 'red'
      }]
    }

    // loops through dataCleanFormat
    for (var i = 0; i < dataCleanFormat.length; i++) {
      // pushes to chartData rows/instances (minutes, category) into datasets[0]. See line 806
      chartData.datasets[0].data.push(
        {
          x: dataCleanFormat[i].x,
          y: dataCleanFormat[i].y,
        }    
      )

      // pushes to chartData rows/instances (label) into datasets[0]. See line 965
      chartData.datasets[0].label.push(
      {label: dataCleanFormat[i].label})
    }

    var myChart = new Chart(ctx, {
      type: 'scatter',
      data: chartData,
      options: {
        // allows for resizing of container manually
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: cleanStatText,
              fontSize: 15,
              fontStyle: "bold",
              fontColor: 'black',
              padding: {
                bottom: 25
              }
            }
          }],
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Minutes",
              fontSize: 15,
              fontStyle: "bold",
              fontColor: 'black',
              padding: {
                top: 25
              }
            }
          }],

        },

        tooltips: {
          callbacks: {
            title: function (tooltipItem, datasets) {
              // console.log(tooltipItem);
              // console.log(tooltipItem[0].index);
              // console.log(datasets);

              // This variable returns the index of the player from the dataset, this is used to map the tooltipItem index with datasets index
              var scatter = tooltipItem[0].index;

              // console.log(datasets.datasets[0].label[scatter])

              return datasets.datasets[0].label[scatter].label;

            }

          },
        },
        legend: {
          display: false
        },
        title: {
          display: true,
          text: `2021/2022 Premier League Players: ${cleanStatText} vs Minutes`,
          fontSize: 20,
          fontColor: 'black',
        }
      }
    });

    // Function gets rid of ChartJS bug when floating over chart
    var scatterPlotButton = document.getElementById("scatterButton");;
    scatterPlotButton.addEventListener("click", function () {
    // This action destroys the previous chart requested by player
    myChart.destroy();
    });


    });
    });
    // START of Resize Container (aesthetic purposes) Function Scope
  var resizeFunc = function() {
    // console.log("this")

    var getTeamScatterButton = document.getElementById("scatterButton");
      
    getTeamScatterButton.addEventListener("click", function(){
      // console.log("this again")

      var getTeamScatterButtonContainer = document.getElementById("scatter-plot-category-chartjs-container");
      
      // sets container height to 75vh only after get stats button is clicked. resizes the container for a larger chart
      getTeamScatterButtonContainer.style["height"] = "75vh";

    });
    // END OF testFunc Scope
  };
  // calling testFunc
  resizeFunc()
};

                        // new Function
// function for scatter plot filtered by team
function player_scatter_team(){

  // declare variable for chartjs canvas tag
  var ctx = document.getElementById('scatter_plot2').getContext('2d');

  var scatterPlotButton2 = document.getElementById("scatterButton2");
  
  // function on scatter button click
  scatterPlotButton2.addEventListener("click", function testing2(){

  // using d3, get teamsList element (select)
  var teamsDropdown = d3.select(teamsList);
  
  // read value of teamsList
  var team = teamsDropdown.property("value");

  // using d3, get statsList2 element (select)
  var statsDropdown = d3.select(statsList2);
  // read value of statsList2
  var stat = statsDropdown.property("value");

  // use this string to query the database through flask route
  url = `query_all_player_stat/${stat}/${team}`;

  // function that reads, maps data from api call
  d3.json(url).then(function(data){

    // maps data to declared variables. Player[category] is where the data is stored
    // stats for player picked from dropdown menu
    var minutes = data.map(Player => Player["minutes"]);
    var statQueried = data.map(Player => Player[stat]);
    var playerName = data.map(Player => Player["player"]);

    var cleanStat = document.getElementById("statsList2");
    // This variable is to obtain the text from dropdown menu statsList2
    var cleanStatText = cleanStat.options[cleanStat.selectedIndex].text;
 
    // declares empty list to eventually store data in
    var dataCleanFormat = []
    
    // for loop the data that is collected using the api call & url
    for(var i=0;i<data.length;i++)
    {
    // obj is the object that will contain x, y categories and label
    var obj = {x:minutes[i],y:statQueried[i], label: playerName[i]};
    // pushes the object into empty array dataCleanFormat
    dataCleanFormat.push(obj);
    }

    console.log(dataCleanFormat);

    // this variable will be used to push the contents of dataCleanFormat into the Chartjs format
    var chartData = {
      datasets: [{
        label: [],
        data: [],
        backgroundColor: 'red'
      }]
    }

    // loops through dataCleanFormat
    for (var i = 0; i < dataCleanFormat.length; i++) {
      // pushes to chartData rows/instances (minutes, category) into datasets[0]. See line 965
      chartData.datasets[0].data.push(
        {
          x: dataCleanFormat[i].x,
          y: dataCleanFormat[i].y,
        }    
      )
      // pushes to chartData rows/instances (label) into datasets[0]. See line 965
      chartData.datasets[0].label.push(
      {label: dataCleanFormat[i].label})
    }

    // starts the chartjs scatter plot chart
    var myChart = new Chart(ctx, {
      type: 'scatter',
      data: chartData,
      options: {
        // allows for resizing of container manually
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: cleanStatText,
              fontSize: 15,
              fontColor: 'black',
              fontStyle: "bold",
              padding: {
                bottom: 25
              }
            }
          }],
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Minutes",
              fontSize: 15,
              fontColor: 'black',
              fontStyle: "bold",
              padding: {
                top: 25
              }
            }
          }],

        },

        tooltips: {
          callbacks: {
            title: function (tooltipItem, datasets) {

              // This variable returns the index of the player from the dataset, this is used to map the tooltipItem index with datasets index
              var scatter = tooltipItem[0].index;

              return datasets.datasets[0].label[scatter].label;

            }

          },
        },
        legend: {
          display: false
        },
        title: {
          display: true,
          text: `2021/2022 Premier League Players: ${cleanStatText} vs Minutes`,
          fontSize: 20,
          fontColor: 'black',
        }
      }
    });

    // Function gets rid of ChartJS bug when floating over chart
    var scatterPlotButton = document.getElementById("scatterButton");;
    scatterPlotButton.addEventListener("click", function () {
    // This action destroys the previous chart requested by player
    myChart.destroy();
    });
  });
});

  // START of Resize Container (aesthetic purposes) Function Scope
  var resizeFunc = function() {
    // console.log("this")

    var getTeamScatterButton = document.getElementById("scatterButton2");
      
    getTeamScatterButton.addEventListener("click", function(){
      console.log("this again")

      var getTeamScatterButtonContainer = document.getElementById("scatter-plot-category-chartjs-container2");
      
      // sets container height to 75vh only after get stats button is clicked. resizes the container for a larger chart
      getTeamScatterButtonContainer.style["height"] = "75vh";

    });
    // END OF testFunc Scope
  };
  // calling testFunc
  resizeFunc()

// end of Team Scatter Plot Function Scope
};
  
  

var scatterPlotButton = document.getElementById("scatterButton");
scatterPlotButton.addEventListener("change", player_scatter());

var scatterPlotButton2 = document.getElementById("scatterButton2");
scatterPlotButton2.addEventListener("click", player_scatter_team());

                    // new Function
// New Function to Create Scatter Plot and filtering out position & price range
function player_scatter_position_price(){

  // declare variable for chartJs chart
  var ctx = document.getElementById('scatterPlotbyPosition_Price').getContext('2d');

  var scatterPlotButton = document.getElementById("getPlayerStatScatterButton");

  // start of 1st Nested function scope
  scatterPlotButton.addEventListener("click", function scatter(){
  
  // use d3 to read select element that contains player Name  
  var playerDropdown = d3.select(playerNameScatter);
  var player = playerDropdown.property("value");

  // use this string to query the database through flask route
  url = `/query_all_player_position/${player}`;
  d3.json(url).then(function(data){

    // console.log(data);
    // console.log(data[0]);

    // maps data to declared variables. Player[category] is where the data is stored
    // stats for player picked from dropdown menu
    var goalsCurrent = data[0].map(Player => Player["goals"]);
    var totalShotscurrent = data[0].map(Player => Player["total_shots"]);
    var playerNamecurrent = data[0].map(Player => Player["player"]);
    
    // last season's stats
    var totalShots = data[1].map(Player => Player["total_shots"]);
    var goals = data[1].map(Player => Player["goals"]);
    var playerName = data[1].map(Player => Player["player"]);
    var playerPosition = data[1].map(Player => Player["player_position"]);
    var playerPrice = data[1].map(Player => Player["current_price"]);
    // var season = data[1].map(Player => Player["season"]);

    if (playerPosition[0] == "Forward" && playerPrice[0] >= 8.0){
      var priceTier = "Expensive (8.0 and above)";
    };

    if (playerPosition[0] == "Forward" && playerPrice[0] < 8.0 && playerPrice[0] >= 6.0){
      var priceTier = "Moderately Priced (6.0 - 7.9)"
    };

    if (playerPosition[0] == "Forward" && playerPrice[0] < 6.0){
      var priceTier = "Cheap (5.9 and below)"
    };

    // Midfielders
    if (playerPosition[0] == "Midfielder" && playerPrice[0] >= 8.0){
      var priceTier = "Expensive (8.0 and above)"
    };

    if (playerPosition[0] == "Midfielder" && playerPrice[0] < 8.0 && playerPrice[0] >= 6.0){
      var priceTier = "Moderately Priced (6.0 - 7.9)"
    };

    if (playerPosition[0] == "Midfielder" && playerPrice[0] < 6.0){
      var priceTier = "Cheap (5.9 and below)"
    };

    // Defenders
    if (playerPosition[0] == "Defender" && playerPrice[0] >= 5.5){
      var priceTier = "Expensive (5.5 and above)"
    };

    if (playerPosition[0] == "Defender" && playerPrice[0] < 5.5 && playerPrice[0] >= 4.5){
      var priceTier = "Moderately Priced (4.5 - 5.4)"
    };

    if (playerPosition[0] == "Defender" && playerPrice[0] < 4.5){
      var priceTier = "Cheap (4.4 and below)"
    };

    // if(playerPosition1 != "Goalkeeper" && playerPosition2 == "Goalkeeper")
    console.log(playerPosition);
    console.log(priceTier);

    // appends last season's stats based on price and position into a new list
    var dataCleanFormat = []

    // for loop the data that is collected using the api call & url
    for(var i=0;i<data[1].length;i++)
    {    
    // obj is the object that will contain x, y categories and label
    var obj = {x:totalShots[i],y:goals[i], label: playerName[i]};
    // pushes the object into empty array dataCleanFormat
    dataCleanFormat.push(obj);
    }

    // appends current season stats for player picked from dropdown menu, into a separate list
    var dataCleanFormat2 = []
    for(var i=0;i<data[0].length;i++)
    {
    var obj = {x:totalShotscurrent[i],y:goalsCurrent[i], label: playerNamecurrent[i]};
    dataCleanFormat2.push(obj);
    }

    // console.log(dataCleanFormat);
    // console.log(dataCleanFormat2);

    var chartData = {
      // dataset[0] is last season's data
      datasets: [{
        label: [],
        data: [],
        backgroundColor: 'red',
        trendlineLinear: {
          style: "#3e95cd",
          lineStyle: "line",
          width: 1
      }
      },
      // dataset[1] is this season's player data
      {
        label: [],
        data: [],
        backgroundColor: 'green'
      }]
    }

    // console.log(chartData)
    // pushing last season's formatted data into the chartData dataset[0]
    for (var i = 0; i < dataCleanFormat.length; i++) {
      chartData.datasets[0].data.push(
        {
          x: dataCleanFormat[i].x,
          y: dataCleanFormat[i].y,
        }    
      )
      chartData.datasets[0].label.push(
      {label: dataCleanFormat[i].label})
    }

    // pushing this season's formatted data into the chartData dataset[0]
    for (var i = 0; i < dataCleanFormat2.length; i++) {
      chartData.datasets[1].data.push(
        {
          x: dataCleanFormat2[i].x,
          y: dataCleanFormat2[i].y,
        }    
      )
      chartData.datasets[1].label.push(
      {label: dataCleanFormat2[i].label})
    }
    // console.log(chartData)

    var myChart = new Chart(ctx, {
      type: 'scatter',
      data: chartData,
      options: {
        // allows for resizing of container manually
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Goals",
              fontSize: 15,
              fontStyle: "bold",
              fontColor: 'black',
              padding: {
                bottom: 25
              }
            }
          }],
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Total Shots",
              fontSize: 15,
              fontStyle: "bold",
              fontColor: 'black',
              padding: {
                top: 25
              }
            }
          }],

        },

        tooltips: {
          callbacks: {
            title: function (tooltipItem, datasets) {
              // console.log(tooltipItem);
              // console.log(tooltipItem[0].index);
              // console.log(datasets);

              // This variable returns the index of the player from the dataset, this is used to map the tooltipItem index with datasets index
              var scatter = tooltipItem[0].index;

              // returns tooltip item from dataset[0], last season's data
              if (tooltipItem[0].datasetIndex == 0){
                return datasets.datasets[0].label[scatter].label;
              }
              
              // returns tooltip item from dataset[1], current season's data
              if (tooltipItem[0].datasetIndex == 1)
              {
                return datasets.datasets[1].label[scatter].label;

              }

            }

          },
        },
        legend: {
          display: false
        },
        title: {
          display: true,
          text: `2021/2022 ${priceTier} ${playerPosition[0]}s: Total Shots vs Goals`,
          fontSize: 20,
          fontColor: 'black',
        }
      }
    });

    // Function gets rid of ChartJS bug when floating over chart
    var scatterPlotButton = document.getElementById("getPlayerStatScatterButton");;
    scatterPlotButton.addEventListener("click", function () {
    // This action destroys the previous chart requested by player
    myChart.destroy();
    });


    });
    });

  // START of Resize Container (aesthetic purposes) Function Scope
  var resizeFunc = function() {
    // console.log("this")

    var getPlayerStatsScatterButton = document.getElementById("getPlayerStatScatterButton");
      
    getPlayerStatsScatterButton.addEventListener("click", function(){
      // console.log("this again")

      var getTrendlineScatterContainer = document.getElementById("scatter-trendline-chartjs-container");
      
      // sets container height to 75vh only after get stats button is clicked. resizes the container for a larger chart
      getTrendlineScatterContainer.style["height"] = "75vh";

    });
    // END OF testFunc Scope
  };
  // calling testFunc
  resizeFunc()

// END OF COMPARE PLAYERS FUNCTION    
};

var scatterPlotButton3 = document.getElementById("getPlayerStatScatterButton");

// starts function scope of trendline scatter plot
scatterPlotButton3.addEventListener("click", player_scatter_position_price());

// Compare Players with an added gameweek filter to track form over desired period of time
// function
function PlayerFormComparison() {
  var button = document.getElementById("player_match_stats");

    button.addEventListener("click", function PlayerFormQuery(){
      
      var playerDropdown = d3.select(player_select1);
      var player = playerDropdown.property("value");

      var playerDropdown2 = d3.select(player_select2);
      var player2 = playerDropdown2.property("value");

      var matchweekDropdown = d3.select(matchweek_start);
      var matchweek = matchweekDropdown.property("value")

      var matchweekDropdown2 = d3.select(matchweek_end);
      var matchweek2 = matchweekDropdown2.property("value")

      var url2 = `/query_match_stats_players/${player}/${player2}/${matchweek}/${matchweek2}`
      d3.json(url2).then(function(data){
        // console.log(data)
        // console.log(data[0])
        // console.log(data[0][0].goals)

        // Initiate collection of goals throughout gameweeks queried (and which player participated in)
        var player1MatchStats = data[0]
        var player2MatchStats = data[1]
        // console.log(player1MatchStats)
        // console.log(player2MatchStats)

        // empty list for goals scored for player 1
        var goalsList = []
        var assistsList = []
        var xGList = []
        var nonPKxGList = []
        var xAList = []
        var shotsList = []
        var shotsOnTargetList = []
        var shotCreatingActionsList = []
        var goalCreatingActionsList =[]
        var progressivePassesList = []
        var successfulDribblesList = []
        var attemptedDribblesList = []
        var touchesList = []
        var pressesList = []
        var interceptionList = []
        var blocksList = []
        var totalMatches = []

        // var totalMatchCount = 0
        // Looping through Player 1 Match Stats
        for (var i = 0; i < player1MatchStats.length; i++){
          goalsList.push(player1MatchStats[i].goals);
          assistsList.push(player1MatchStats[i].assists);
          xGList.push(player1MatchStats[i].expected_goals);
          nonPKxGList.push(player1MatchStats[i].non_penalty_expected_goals);
          xAList.push(player1MatchStats[i].expected_assists);
          shotsList.push(player1MatchStats[i].shots);
          shotsOnTargetList.push(player1MatchStats[i].shots_on_target);
          shotCreatingActionsList.push(player1MatchStats[i].shot_creating_actions);
          goalCreatingActionsList.push(player1MatchStats[i].goal_creating_actions);
          progressivePassesList.push(player1MatchStats[i].progressive_passes);
          successfulDribblesList.push(player1MatchStats[i].successful_dribbles);
          attemptedDribblesList.push(player1MatchStats[i].attempted_dribbles);
          touchesList.push(player1MatchStats[i].touches);
          pressesList.push(player1MatchStats[i].presses);
          interceptionList.push(player1MatchStats[i].interceptions);
          blocksList.push(player1MatchStats[i].blocks);
          totalMatches.push(1);
        }
        // console.log(totalMatches.length);

        // Express the average goals through the gameweeks queried
        // total goals = 0 before looping to through list
        var totalGoals = 0;

        var totalAssists = 0;

        var totalxG = 0;

        var totalxA = 0;

        var totalxA = 0;

        var totalNonPKxG = 0;
        
        var totalShots = 0;

        var totalShotsOnTarget = 0;

        var totalShotCreatingActions = 0

        var totalGoalCreatingActions = 0

        var totalprogressivePasses = 0

        var totalsuccessfulDribbles = 0

        var totalattemptedDribbles = 0

        var totalTouches = 0

        var totalPresses = 0

        var totalInterceptions = 0

        var totalBlocks = 0

        // var total = 0
        // Loop through goals category in all games played
        for (var i = 0; i < totalMatches.length; i++){
          totalGoals += goalsList[i]
          totalAssists += assistsList[i]
          totalxG += xGList[i]
          totalxA += xAList[i]
          totalNonPKxG += nonPKxGList[i]
          totalShots += shotsList[i]
          totalShotsOnTarget += shotsOnTargetList[i]
          totalShotCreatingActions += shotCreatingActionsList[i]
          totalGoalCreatingActions += goalCreatingActionsList[i]
          totalprogressivePasses += progressivePassesList[i]
          totalsuccessfulDribbles += successfulDribblesList[i]
          totalattemptedDribbles += attemptedDribblesList[i]
          totalTouches += touchesList[i]
          totalPresses += pressesList[i]
          totalInterceptions += interceptionList[i]
          totalBlocks += blocksList[i]
        } 

        // Express average goals scored
        var AvgGoals = (totalGoals/goalsList.length)
        // console.log(parseFloat(AvgGoals).toFixed(2))

        // Express average assists
        var AvgAssists = (totalAssists/assistsList.length)
        // console.log(parseFloat(AvgAssists).toFixed(2))

        var AvgxG = (totalxG/xGList.length)
        // console.log(parseFloat(AvgxG).toFixed(2))

        var AvgNonPKxG = (totalNonPKxG/nonPKxGList.length)
        // console.log(parseFloat(AvgNonPKxG).toFixed(2))

        var AvgxA = (totalxA/xGList.length)
        // console.log(parseFloat(AvgxA).toFixed(2))

        var AvgShots = (totalShots/shotsList.length)
        // console.log(parseFloat(AvgShots).toFixed(2))

        var AvgShotsOnTarget = (totalShotsOnTarget/shotsList.length)
        // console.log(parseFloat(AvgShotsOnTarget).toFixed(2))

        var AvgShotCreatingActions = (totalShotCreatingActions/shotCreatingActionsList.length)
        // console.log(parseFloat(AvgShotCreatingActions).toFixed(2))

        var AvgGoalCreatingActions = (totalGoalCreatingActions/goalCreatingActionsList.length)
        // console.log(parseFloat(AvgGoalCreatingActions).toFixed(2))

        var AvgProgressivePasses = (totalprogressivePasses/progressivePassesList.length)
        // console.log(parseFloat(AvgProgressivePasses).toFixed(2))

        var AvgSuccessfulDribbles = (totalsuccessfulDribbles/successfulDribblesList.length)
        // console.log(parseFloat(AvgSuccessfulDribbles).toFixed(2))

        var AvgAttemptedDribbles = (totalattemptedDribbles/attemptedDribblesList.length)
        // console.log(parseFloat(AvgAttemptedDribbles).toFixed(2))

        var AvgTouches = (totalTouches/touchesList.length)
        // console.log(parseFloat(AvgTouches).toFixed(2))

        var AvgPresses = (totalPresses/pressesList.length)
        // console.log(parseFloat(AvgPresses).toFixed(2))

        var AvgInterceptions = (totalInterceptions/interceptionList.length)
        // console.log(parseFloat(AvgInterception).toFixed(2))

        var AvgBlocks= (totalBlocks/blocksList.length)
        // console.log(parseFloat(AvgBlocks).toFixed(2))

        // empty list for goals scored for player 2
        var goalsList2 = []
        var assistsList2 = []
        var xGList2 = []
        var nonPKxGList2 = []
        var xAList2 = []
        var shotsList2 = []
        var shotsOnTargetList2 = []
        var shotCreatingActionsList2 = []
        var goalCreatingActionsList2 =[]
        var progressivePassesList2 = []
        var successfulDribblesList2 = []
        var attemptedDribblesList2 = []
        var touchesList2 = []
        var pressesList2 = []
        var interceptionList2 = []
        var blocksList2 = []
        var totalMatches2 = []

        // Looping through Player 2 Match Stats
        for (var i = 0; i < player2MatchStats.length; i++){
          goalsList2.push(player2MatchStats[i].goals);
          totalMatches2.push(1)
          assistsList2.push(player2MatchStats[i].assists)
          xGList2.push(player2MatchStats[i].expected_goals)
          nonPKxGList2.push(player2MatchStats[i].non_penalty_expected_goals)
          xAList2.push(player2MatchStats[i].expected_assists)
          shotsList2.push(player2MatchStats[i].shots)
          shotsOnTargetList2.push(player2MatchStats[i].shots_on_target)
          shotCreatingActionsList2.push(player2MatchStats[i].shot_creating_actions);
          goalCreatingActionsList2.push(player2MatchStats[i].goal_creating_actions);
          progressivePassesList2.push(player2MatchStats[i].progressive_passes);
          successfulDribblesList2.push(player2MatchStats[i].successful_dribbles);
          attemptedDribblesList2.push(player2MatchStats[i].attempted_dribbles);
          touchesList2.push(player2MatchStats[i].touches);
          pressesList2.push(player2MatchStats[i].presses);
          interceptionList2.push(player2MatchStats[i].interceptions);
          blocksList2.push(player2MatchStats[i].blocks);

          // shotsOnTargetList2
        }
        // console.log(goalsList2)
        // console.log(totalMatches2.length)

        // total goals = 0 before looping to through list
        var totalGoals2 = 0;

        var totalAssists2 = 0;

        var totalxG2 = 0;

        var totalxA2 = 0;

        var totalNonPKxG2 = 0;

        var totalShots2 = 0;

        var totalShotsOnTarget2 = 0;
        
        var totalShotCreatingActions2 = 0

        var totalGoalCreatingActions2 = 0

        var totalprogressivePasses2 = 0

        var totalsuccessfulDribbles2 = 0

        var totalattemptedDribbles2 = 0

        var totalTouches2 = 0

        var totalPresses2 = 0

        var totalInterceptions2 = 0

        var totalBlocks2 = 0

        // Loop through goals category in all games played
        for (var i = 0; i < totalMatches2.length; i++){
          totalGoals2 += goalsList2[i]
          totalAssists2 += assistsList2[i]
          totalxG2 += xGList2[i]
          totalxA2 += xAList2[i]
          totalNonPKxG2 += nonPKxGList2[i]
          totalShots2 += shotsList2[i]
          totalShotsOnTarget2 += shotsOnTargetList2[i]
          totalShotCreatingActions2 += shotCreatingActionsList2[i]
          totalGoalCreatingActions2 += goalCreatingActionsList2[i]
          totalprogressivePasses2 += progressivePassesList2[i]
          totalsuccessfulDribbles2 += successfulDribblesList2[i]
          totalattemptedDribbles2 += attemptedDribblesList2[i]
          totalTouches2 += touchesList2[i]
          totalPresses2 += pressesList2[i]
          totalInterceptions2 += interceptionList2[i]
          totalBlocks2 += blocksList2[i]
        }

        // Express average goals scored
        var AvgGoals2 = (totalGoals2/goalsList2.length)
        // console.log(parseFloat(AvgGoals2).toFixed(2))
        // Express average assists
        var AvgAssists2 = (totalAssists2/assistsList2.length)
        // console.log(parseFloat(AvgAssists2).toFixed(2))

        var AvgxG2 = (totalxG2/xGList2.length)
        // console.log(parseFloat(AvgxG2).toFixed(2))

        var AvgNonPKxG2 = (totalNonPKxG2/nonPKxGList2.length)
        // console.log(parseFloat(AvgNonPKxG2).toFixed(2))

        var AvgxA2 = (totalxA2/xGList2.length)
        // console.log(parseFloat(AvgxA2).toFixed(2))

        var AvgShots2 = (totalShots2/shotsList2.length)
        // console.log(parseFloat(AvgShots2).toFixed(2))

        var AvgShotsOnTarget2 = (totalShotsOnTarget2/shotsList2.length)
        // console.log(parseFloat(AvgShotsOnTarget2).toFixed(2))

        var AvgShotCreatingActions2 = (totalShotCreatingActions2/shotCreatingActionsList2.length)
        // console.log(parseFloat(AvgShotCreatingActions2).toFixed(2))

        var AvgGoalCreatingActions2 = (totalGoalCreatingActions2/goalCreatingActionsList2.length)
        // console.log(parseFloat(AvgGoalCreatingActions2).toFixed(2))

        var AvgProgressivePasses2 = (totalprogressivePasses2/progressivePassesList2.length)
        // console.log(parseFloat(AvgProgressivePasses2).toFixed(2))

        // start
        var AvgSuccessfulDribbles2 = (totalsuccessfulDribbles2/successfulDribblesList2.length)
        // console.log(parseFloat(AvgProgressivePasses2).toFixed(2))

        var AvgAttemptedDribbles2 = (totalattemptedDribbles2/attemptedDribblesList2.length)
        // console.log(parseFloat(AvgProgressivePasses2).toFixed(2))

        var AvgTouches2 = (totalTouches2/touchesList2.length)
        // console.log(parseFloat(AvgProgressivePasses2).toFixed(2))

        var AvgPresses2 = (totalPresses2/pressesList2.length)
        // console.log(parseFloat(AvgProgressivePasses2).toFixed(2))

        var AvgInterceptions2 = (totalInterceptions2/interceptionList2.length)
        // console.log(parseFloat(AvgProgressivePasses2).toFixed(2))

        var AvgBlocks2 = (totalBlocks2/blocksList2.length)
        // console.log(parseFloat(AvgProgressivePasses2).toFixed(2))


        // Display Player Name
        document.getElementById("match_stats_player_name").innerHTML = `${player}`;
        document.getElementById("match_stats_player_name2").innerHTML = `${player2}`;

        // send Average Goals to Element with said ID
        document.getElementById("test_avg_goals").innerHTML = `Average Goals: ${parseFloat(AvgGoals).toFixed(2)}`;
        document.getElementById("test_avg_goals2").innerHTML = `Average Goals: ${parseFloat(AvgGoals2).toFixed(2)}`;

        // send Goals to Element with said ID
        document.getElementById("goals").innerHTML = `Total Goals Scored: ${totalGoals}`;
        document.getElementById("goals2").innerHTML = `Total Goals Scored: ${totalGoals2}`;

        // send Games Played to Element with said ID
        document.getElementById("games_played_player1").innerHTML = `Games Played: ${totalMatches.length}`;
        document.getElementById("games_played_player2").innerHTML = `Games Played: ${totalMatches2.length}`;

        // send Average Assists to Element with said ID
        document.getElementById("test_avg_assists").innerHTML = `Average Assists: ${parseFloat(AvgAssists).toFixed(2)}`;
        document.getElementById("test_avg_assists2").innerHTML = `Average Assists: ${parseFloat(AvgAssists2).toFixed(2)}`;

        // send Total Assists to Element with said ID
        document.getElementById("assists").innerHTML = `Total Assists: ${totalAssists}`;
        document.getElementById("assists2").innerHTML = `Total Assists: ${totalAssists2}`;
        
        // send xG to Element with said ID
        document.getElementById("avg_xG").innerHTML = `Average Expected Goals: ${parseFloat(AvgxG).toFixed(2)}`;
        document.getElementById("avg_xG2").innerHTML = `Average Expected Goals: ${parseFloat(AvgxG2).toFixed(2)}`;

        // send xA to Element with said ID
        document.getElementById("avg_xA").innerHTML = `Average Expected Assists: ${parseFloat(AvgxA).toFixed(2)}`;
        document.getElementById("avg_xA2").innerHTML = `Average Expected Asissts: ${parseFloat(AvgxA2).toFixed(2)}`;

        // send xA to Element with said ID
        document.getElementById("shots_on_target1").innerHTML = `Total Shots on Target: ${(totalShotsOnTarget)}`;
        document.getElementById("shots_on_target2").innerHTML = `Total Shots on Target: ${(totalShotsOnTarget2)}`;

        // send xA to Element with said ID
        document.getElementById("avg_shots_on_target1").innerHTML = `Average Shots on Target: ${parseFloat(AvgShotsOnTarget).toFixed(2)}`;
        document.getElementById("avg_shots_on_target2").innerHTML = `Average Shots on Target: ${parseFloat(AvgShotsOnTarget2).toFixed(2)}`;

        // send xG to Element with said ID
        document.getElementById("avg_non_pk_xG").innerHTML = `Average Non PK Expected Goals: ${parseFloat(AvgNonPKxG).toFixed(2)}`;
        document.getElementById("avg_non_pk_xG2").innerHTML = `Average Non PK Expected Goals: ${parseFloat(AvgNonPKxG2).toFixed(2)}`;
        
        document.getElementById("avg_shot_creating_actions").innerHTML = `Average Shot Creating Actions: ${parseFloat(AvgShotCreatingActions).toFixed(2)}`;
        document.getElementById("avg_shot_creating_actions2").innerHTML = `Average Shot Creating Actions: ${parseFloat(AvgShotCreatingActions2).toFixed(2)}`;

        document.getElementById("avg_goal_creating_actions").innerHTML = `Average Goal Creating Actions: ${parseFloat(AvgGoalCreatingActions).toFixed(2)}`;
        document.getElementById("avg_goal_creating_actions2").innerHTML = `Average Goal Creating Actions: ${parseFloat(AvgGoalCreatingActions2).toFixed(2)}`;

        document.getElementById("avg_progressive_passes").innerHTML = `Average Progressive Passes: ${parseFloat(AvgProgressivePasses).toFixed(2)}`;
        document.getElementById("avg_progressive_passes2").innerHTML = `Average Progressive Passes: ${parseFloat(AvgProgressivePasses2).toFixed(2)}`;

        document.getElementById("avg_successful_dribbles").innerHTML = `Average Successful Dribbles: ${parseFloat(AvgSuccessfulDribbles).toFixed(2)}`;
        document.getElementById("avg_successful_dribbles2").innerHTML = `Average Successful Dribbles: ${parseFloat(AvgSuccessfulDribbles2).toFixed(2)}`;

        document.getElementById("avg_attempted_dribbles").innerHTML = `Average Attempted Dribbles: ${parseFloat(AvgAttemptedDribbles).toFixed(2)}`;
        document.getElementById("avg_attempted_dribbles2").innerHTML = `Average Attempted Dribbles: ${parseFloat(AvgAttemptedDribbles2).toFixed(2)}`;

        document.getElementById("avg_touches").innerHTML = `Average Touches: ${parseFloat(AvgTouches).toFixed(2)}`;
        document.getElementById("avg_touches2").innerHTML = `Average Touches: ${parseFloat(AvgTouches2).toFixed(2)}`;

        document.getElementById("avg_presses").innerHTML = `Average Presses: ${parseFloat(AvgPresses).toFixed(2)}`;
        document.getElementById("avg_presses2").innerHTML = `Average Presses: ${parseFloat(AvgPresses2).toFixed(2)}`;

        document.getElementById("avg_interceptions").innerHTML = `Average Interceptions: ${parseFloat(AvgInterceptions).toFixed(2)}`;
        document.getElementById("avg_interceptions2").innerHTML = `Average Interceptions: ${parseFloat(AvgInterceptions2).toFixed(2)}`;

        document.getElementById("avg_blocks").innerHTML = `Average Blocks: ${parseFloat(AvgBlocks).toFixed(2)}`;
        document.getElementById("avg_blocks2").innerHTML = `Average Blocks: ${parseFloat(AvgBlocks2).toFixed(2)}`;

        // Compare Number of Goals Scored to Highlight which player has more
        if (totalGoals > totalGoals2){
          // console.log(`${player} ${totalGoals} is better`)
          document.getElementById("goals").style.color = "yellow"
          document.getElementById("goals2").style.color = "white"
        } else if (totalGoals < totalGoals2){
          document.getElementById("goals2").style.color = "yellow"
          document.getElementById("goals").style.color = "white"
        } else if (totalGoals == totalGoals2){
          document.getElementById("goals").style.color = "yellow"
          document.getElementById("goals2").style.color = "yellow"
        }

        // Compare Games Played Scored to Highlight which player has more
        if (totalMatches.length > totalMatches2.length){
          document.getElementById("games_played_player1").style.color = "yellow"
          document.getElementById("games_played_player2").style.color = "white"
        } else if (totalMatches.length < totalMatches2.length){
          document.getElementById("games_played_player2").style.color = "yellow"
          document.getElementById("games_played_player1").style.color = "white"
        } else if (totalMatches.length == totalMatches2.length){
          document.getElementById("games_played_player1").style.color = "yellow"
          document.getElementById("games_played_player2").style.color = "yellow"
        }

        // Compare Average Goals Scored to Highlight which player has more
        if (AvgGoals > AvgGoals2){
          document.getElementById("test_avg_goals").style.color = "yellow"
          document.getElementById("test_avg_goals2").style.color = "white"
        } else if (AvgGoals < AvgGoals2){
          document.getElementById("test_avg_goals2").style.color = "yellow"
          document.getElementById("test_avg_goals").style.color = "white"
        } else if (AvgGoals == AvgGoals2){
          document.getElementById("test_avg_goals").style.color = "yellow"
          document.getElementById("test_avg_goals2").style.color = "yellow"
        }

        // Compare Assists to Highlight which player has more
        if (totalAssists > totalAssists2){
          document.getElementById("assists").style.color = "yellow"
          document.getElementById("assists2").style.color = "white"
        } else if (totalAssists < totalAssists2){
          document.getElementById("assists2").style.color = "yellow"
          document.getElementById("assists").style.color = "white"
        } else if (totalAssists == totalAssists2){
          document.getElementById("assists").style.color = "yellow"
          document.getElementById("assists2").style.color = "yellow"
        }

        // Compare Average Assists to Highlight which player has more
        if (AvgAssists > AvgAssists2){
          document.getElementById("test_avg_assists").style.color = "yellow"
          document.getElementById("test_avg_assists2").style.color = "white"
        } else if (AvgAssists < AvgAssists2){
          document.getElementById("test_avg_assists2").style.color = "yellow"
          document.getElementById("test_avg_assists").style.color = "white"
        } else if (AvgAssists == AvgAssists2){
          document.getElementById("test_avg_assists").style.color = "yellow"
          document.getElementById("test_avg_assists2").style.color = "yellow"
        }

        // Compare Average Expected Goals to Highlight which player has more
        if (AvgxG > AvgxG2){
          document.getElementById("avg_xG").style.color = "yellow"
          document.getElementById("avg_xG2").style.color = "white"
        } else if (AvgxG < AvgxG2){
          console.log(`${AvgxG} < ${AvgxG2}`)
          document.getElementById("avg_xG2").style.color = "yellow"
          document.getElementById("avg_xG").style.color = "white"
        } else if (AvgxG == AvgxG2){
          document.getElementById("avg_xG").style.color = "yellow"
          document.getElementById("avg_xG2").style.color = "yellow"
        }

        // Compare Average Expected Assists to Highlight which player has more
        if (AvgxA > AvgxA2){
          document.getElementById("avg_xA").style.color = "yellow"
          document.getElementById("avg_xA2").style.color = "white"
        } else if (AvgxA < AvgxA2){
          document.getElementById("avg_xA2").style.color = "yellow"
          document.getElementById("avg_xA").style.color = "white"
        } else if (AvgxA == AvgxA2){
          document.getElementById("avg_xA").style.color = "yellow"
          document.getElementById("avg_xA2").style.color = "yellow"
        }

        // Compare Total Shots on Target to Highlight which player has more
        if (totalShotsOnTarget > totalShotsOnTarget2){
          document.getElementById("shots_on_target1").style.color = "yellow"
          document.getElementById("shots_on_target2").style.color = "white"
        } else if (totalShotsOnTarget < totalShotsOnTarget2){
          document.getElementById("shots_on_target2").style.color = "yellow"
          document.getElementById("shots_on_target1").style.color = "white"
        } else if (totalShotsOnTarget == totalShotsOnTarget2){
          document.getElementById("shots_on_target1").style.color = "yellow"
          document.getElementById("shots_on_target2").style.color = "yellow"
        }

        // Compare Average Shots on Target to Highlight which player has more
        if (AvgShotsOnTarget > AvgShotsOnTarget2){
          document.getElementById("avg_shots_on_target1").style.color = "yellow"
          document.getElementById("avg_shots_on_target2").style.color = "white"
        } else if (AvgShotsOnTarget < AvgShotsOnTarget2){
          document.getElementById("avg_shots_on_target2").style.color = "yellow"
          document.getElementById("avg_shots_on_target1").style.color = "white"
        } else if (AvgShotsOnTarget == AvgShotsOnTarget2){
          document.getElementById("avg_shots_on_target1").style.color = "yellow"
          document.getElementById("avg_shots_on_target2").style.color = "yellow"
        }

        // Compare Average Non PK xG to Highlight which player has more
        if (AvgNonPKxG > AvgNonPKxG2){
          document.getElementById("avg_non_pk_xG").style.color = "yellow"
          document.getElementById("avg_non_pk_xG2").style.color = "white"
        } else if (AvgNonPKxG < AvgNonPKxG2){
          document.getElementById("avg_non_pk_xG2").style.color = "yellow"
          document.getElementById("avg_non_pk_xG").style.color = "white"
        } else if (AvgNonPKxG == AvgNonPKxG2){
          document.getElementById("avg_non_pk_xG").style.color = "yellow"
          document.getElementById("avg_non_pk_xG2").style.color = "yellow"
        }

        // Compare Average Shot Creating Actions to Highlight which player has more
        if (AvgShotCreatingActions > AvgShotCreatingActions2){
          document.getElementById("avg_shot_creating_actions").style.color = "yellow"
          document.getElementById("avg_shot_creating_actions2").style.color = "white"
        } else if (AvgShotCreatingActions < AvgShotCreatingActions2){
          document.getElementById("avg_shot_creating_actions2").style.color = "yellow"
          document.getElementById("avg_shot_creating_actions").style.color = "white"
        } else if (AvgShotCreatingActions == AvgShotCreatingActions2){
          document.getElementById("avg_shot_creating_actions").style.color = "yellow"
          document.getElementById("avg_shot_creating_actions2").style.color = "yellow"
        }

        // Compare Average Goal Creating Actions to Highlight which player has more
        if (AvgGoalCreatingActions > AvgGoalCreatingActions2){
          document.getElementById("avg_goal_creating_actions").style.color = "yellow"
          document.getElementById("avg_goal_creating_actions2").style.color = "white"
        } else if (AvgGoalCreatingActions < AvgGoalCreatingActions2){
          document.getElementById("avg_goal_creating_actions2").style.color = "yellow"
          document.getElementById("avg_goal_creating_actions").style.color = "white"
        } else if (AvgGoalCreatingActions == AvgGoalCreatingActions2){
          document.getElementById("avg_goal_creating_actions").style.color = "yellow"
          document.getElementById("avg_goal_creating_actions2").style.color = "yellow"
        }

        // Compare Average Progressive Passes to Highlight which player has more
        if (AvgProgressivePasses > AvgProgressivePasses2){
          document.getElementById("avg_progressive_passes").style.color = "yellow"
          document.getElementById("avg_progressive_passes2").style.color = "white"
        } else if (AvgProgressivePasses < AvgProgressivePasses2){
          document.getElementById("avg_progressive_passes2").style.color = "yellow"
          document.getElementById("avg_progressive_passes").style.color = "white"
        } else if (AvgProgressivePasses == AvgProgressivePasses2){
          document.getElementById("avg_progressive_passes").style.color = "yellow"
          document.getElementById("avg_progressive_passes2").style.color = "yellow"
        }

        // Compare Average Successful Dribbles to Highlight which player has more
        if (AvgSuccessfulDribbles > AvgSuccessfulDribbles2){
          document.getElementById("avg_successful_dribbles").style.color = "yellow"
          document.getElementById("avg_successful_dribbles2").style.color = "white"
        } else if (AvgSuccessfulDribbles < AvgSuccessfulDribbles2){
          document.getElementById("avg_successful_dribbles2").style.color = "yellow"
          document.getElementById("avg_successful_dribbles").style.color = "white"
        } else if (AvgSuccessfulDribbles == AvgSuccessfulDribbles2){
          document.getElementById("avg_successful_dribbles").style.color = "yellow"
          document.getElementById("avg_successful_dribbles2").style.color = "yellow"
        }

        // Compare Average Attempted Dribbles to Highlight which player has more
        if (AvgAttemptedDribbles > AvgAttemptedDribbles2){
          document.getElementById("avg_attempted_dribbles").style.color = "yellow"
          document.getElementById("avg_attempted_dribbles2").style.color = "white"
        } else if (AvgAttemptedDribbles < AvgAttemptedDribbles2){
          document.getElementById("avg_attempted_dribbles2").style.color = "yellow"
          document.getElementById("avg_attempted_dribbles").style.color = "white"
        } else if (AvgAttemptedDribbles == AvgAttemptedDribbles2){
          document.getElementById("avg_attempted_dribbles").style.color = "yellow"
          document.getElementById("avg_attempted_dribbles2").style.color = "yellow"
        }

        // Compare Average Touches to Highlight which player has more
        if (AvgTouches > AvgTouches2){
          document.getElementById("avg_touches").style.color = "yellow"
          document.getElementById("avg_touches2").style.color = "white"
        } else if (AvgTouches < AvgTouches2){
          document.getElementById("avg_touches2").style.color = "yellow"
          document.getElementById("avg_touches").style.color = "white"
        } else if (AvgTouches == AvgTouches2){
          document.getElementById("avg_touches").style.color = "yellow"
          document.getElementById("avg_touches2").style.color = "yellow"
        }

        // Compare Average Touches to Highlight which player has more
        if (AvgPresses > AvgPresses2){
          document.getElementById("avg_presses").style.color = "yellow"
          document.getElementById("avg_presses2").style.color = "white"
        } else if (AvgPresses < AvgPresses2){
          document.getElementById("avg_presses2").style.color = "yellow"
          document.getElementById("avg_presses").style.color = "white"
        } else if (AvgPresses == AvgPresses2){
          document.getElementById("avg_presses").style.color = "yellow"
          document.getElementById("avg_presses2").style.color = "yellow"
        }

        // Compare Average Touches to Highlight which player has more
        if (AvgInterceptions > AvgInterceptions2){
          document.getElementById("avg_interceptions").style.color = "yellow"
          document.getElementById("avg_interceptions2").style.color = "white"
        } else if (AvgInterceptions < AvgInterceptions2){
          document.getElementById("avg_interceptions2").style.color = "yellow"
          document.getElementById("avg_interceptions").style.color = "white"
        } else if (AvgInterceptions == AvgInterceptions2){
          document.getElementById("avg_interceptions").style.color = "yellow"
          document.getElementById("avg_interceptions2").style.color = "yellow"
        }

        // Compare Average Touches to Highlight which player has more
        if (AvgBlocks > AvgBlocks2){
          document.getElementById("avg_blocks").style.color = "yellow"
          document.getElementById("avg_blocks2").style.color = "white"
        } else if (AvgBlocks < AvgBlocks2){
          document.getElementById("avg_blocks2").style.color = "yellow"
          document.getElementById("avg_blocks").style.color = "white"
        } else if (AvgBlocks == AvgBlocks2){
          document.getElementById("avg_blocks").style.color = "yellow"
          document.getElementById("avg_blocks2").style.color = "yellow"
        }
      })
    }

  )
};

var MatchCompareButton = document.getElementById("player_match_stats")
MatchCompareButton.addEventListener("change", PlayerFormComparison())
