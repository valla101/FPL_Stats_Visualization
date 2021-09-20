// remove fragment as much as it can go without adding an entry in browser history:
window.location.replace("#");

// slice off the remaining '#' in HTML5:    
if (typeof window.history.replaceState == 'function') {
  history.replaceState({}, '', window.location.href.slice(0, -1));
}

// FUNCTIONAL bar graph that will create a bar graph, filtering stats in descending order
// Produces the Bar Graph based on Stat Selected
function interactivePlot(stat){
  var ctx = document.getElementById('statBarGraph').getContext('2d');

  var statsDropdown = d3.select(statsList);
  var stat = statsDropdown.property("value");
  var url2 = `${stat}/${10}`
  d3.json(url2).then(function(data) {

    var cleanStat = document.getElementById("statsList");
    // This variable is to obtain the text from dropdown menu statsList2
    var cleanStatText = cleanStat.options[cleanStat.selectedIndex].text;
  
      console.log(data);
  
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
          // indexAxis: 'y',
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
    console.log(data)
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
// Route for Player Offensive Stats. Generates a Bar Graph
function filterByPlayer(){

  var ctx = document.getElementById('playerBarChart').getContext('2d');

  var getPlayerStatsButton = document.getElementById("getPlayerStatsButton");
  getPlayerStatsButton.addEventListener("click", function playerSelected() {

    // var playerDropdown = d3.select("#playerName");
    var player = document.getElementById("playerName").value;
    var test_url = `/query_all_players/${player}`;
    d3.json(test_url).then(function(data){
      console.log(data);

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
      else{var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Total Points', 'Total Saves', 'Save Percentage', 'Shots on Target Against', 'Clean Sheets', 'Clean Sheet Percentage', "Goals Conceded", "Goals Conceded Per 90", "Penalty Kicks Attempted Against", "Saved Penalty Kicks", "Penalty Kicks Scored Against", "Penalty Kicks Missed Against"],
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
        options: 
        {
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
      });}

     
  });
});
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

      // Conditional Statement to compare 2 Goalkeepers
      if(playerPosition1 == "Goalkeeper" && playerPosition2 == "Goalkeeper"){
        var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Total Points', 'Total Saves', 'Save Percentage', 'Shots on Target Against', 'Clean Sheets', 'Clean Sheet Percentage', "Goals Conceded", "Goals Conceded Per 90", "Penalty Kicks Attempted Against", "Saved Penalty Kicks", "Penalty Kicks Scored Against", "Penalty Kicks Missed Against"],
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
});
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
});

// ------------------------------------
// New Function to Create Scatter Plot
function player_scatter(){
  var ctx = document.getElementById('scatter_plot').getContext('2d');

  var scatterPlotButton = document.getElementById("scatterButton");
  scatterPlotButton.addEventListener("click", function scatter(){
    
  var statsDropdown = d3.select(statsList2);
  var stat = statsDropdown.property("value");
  
  
;

  url = `query_all_player_stat/${stat}`;
  d3.json(url).then(function(data){

    var minutes = data.map(Player => Player["minutes"]);
    var statQueried = data.map(Player => Player[stat]);
    var playerName = data.map(Player => Player["player"]);

    var cleanStat = document.getElementById("statsList2");
    // This variable is to obtain the text from dropdown menu statsList2
    var cleanStatText = cleanStat.options[cleanStat.selectedIndex].text;

    var dataCleanFormat = []
    for(var i=0;i<data.length;i++)
    {
    var obj = {x:minutes[i],y:statQueried[i], label: playerName[i]};
    dataCleanFormat.push(obj);
    }

    console.log(dataCleanFormat);

    var chartData = {
      datasets: [{
        label: [],
        data: [],
        backgroundColor: 'red'
      }]
    }

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

    var myChart = new Chart(ctx, {
      type: 'scatter',
      data: chartData,
      options: {
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
    };




function player_scatter_team(){
  var ctx = document.getElementById('scatter_plot2').getContext('2d');

  var scatterPlotButton2 = document.getElementById("scatterButton2");
  scatterPlotButton2.addEventListener("click", function testing2(){
  var teamsDropdown = d3.select(teamsList);
  var team = teamsDropdown.property("value");

  var statsDropdown = d3.select(statsList2);
  var stat = statsDropdown.property("value");

  url = `query_all_player_stat/${stat}/${team}`;

  
  d3.json(url).then(function(data){
    console.log(data);
    var minutes = data.map(Player => Player["minutes"]);
    var statQueried = data.map(Player => Player[stat]);
    var playerName = data.map(Player => Player["player"]);

    var cleanStat = document.getElementById("statsList2");
    // This variable is to obtain the text from dropdown menu statsList2
    var cleanStatText = cleanStat.options[cleanStat.selectedIndex].text;
 
    var dataCleanFormat = []
    for(var i=0;i<data.length;i++)
    {
    var obj = {x:minutes[i],y:statQueried[i], label: playerName[i]};
    dataCleanFormat.push(obj);
    }

    console.log(dataCleanFormat);

    var chartData = {
      datasets: [{
        label: [],
        data: [],
        backgroundColor: 'red'
      }]
    }

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

    var myChart = new Chart(ctx, {
      type: 'scatter',
      data: chartData,
      options: {
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
};
  
  

var scatterPlotButton = document.getElementById("scatterButton");
scatterPlotButton.addEventListener("change", player_scatter());

var scatterPlotButton2 = document.getElementById("scatterButton2");
scatterPlotButton2.addEventListener("click", player_scatter_team());


// New Function to Create Scatter Plot and filtering out position & price range
function player_scatter_position_price(){
  var ctx = document.getElementById('scatterPlotbyPosition_Price').getContext('2d');

  var scatterPlotButton = document.getElementById("getPlayerStatScatterButton");
  scatterPlotButton.addEventListener("click", function scatter(){
    
  var playerDropdown = d3.select(playerNameScatter);
  var player = playerDropdown.property("value");
  
  
;

  url = `/query_all_player_position/${player}`;
  d3.json(url).then(function(data){

    console.log(data);
    console.log(data[0]);

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
    for(var i=0;i<data[1].length;i++)
    {
    var obj = {x:totalShots[i],y:goals[i], label: playerName[i]};
    dataCleanFormat.push(obj);
    }

    // appends current season stats for player picked from dropdown menu, into a separate list
    var dataCleanFormat2 = []
    for(var i=0;i<data[0].length;i++)
    {
    var obj = {x:totalShotscurrent[i],y:goalsCurrent[i], label: playerNamecurrent[i]};
    dataCleanFormat2.push(obj);
    }

    console.log(dataCleanFormat);
    console.log(dataCleanFormat2);

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
    console.log(chartData)

    var myChart = new Chart(ctx, {
      type: 'scatter',
      data: chartData,
      options: {
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
    };

var scatterPlotButton3 = document.getElementById("getPlayerStatScatterButton");
scatterPlotButton3.addEventListener("click", player_scatter_position_price());


// url = `/query_all_player_position2/Harry Kane`;
// d3.json(url).then(function(data){

// console.log(data[0]);
// console.log(data[1]);}
//   );