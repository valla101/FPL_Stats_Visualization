// Dark Mode Button

var darkMode = document.getElementById("dark_mode");

darkMode.addEventListener("click", function(){
  var body = document.getElementById("body");
  body.style.backgroundColor = "black";

  var headerPicture = document.getElementById("header_pic");
  headerPicture.style.backgroundColor="#eae9de85";

  var index;
  var headerText = document.getElementsByClassName("header_for_graph");
  for (index = 0; index < headerText.length; ++index) {
    headerText[index].style.color ="#eae9de85";
}
  // If Reset Dark Mode Doesn't Exist, it will be created.
  // Else, no new buttons will be created
  if($('#reset_dark_mode').length == 0){
    var resetDarkMode = document.createElement("button");
  }
  else{console.log("dark mode already clicked");

  };

  resetDarkMode.className = "btn btn-primary";
  resetDarkMode.textContent = "Reset Color Scheme";
  resetDarkMode.setAttribute("id", "reset_dark_mode");
  
  var headerElement = document.getElementById("header");

  headerElement.insertAdjacentElement('beforeend', resetDarkMode);

  resetDarkMode.addEventListener("click", function(){
    console.log("reset color");
    var body = document.getElementById("body");
    body.style.backgroundColor = "#4bb370";

    var headerPicture = document.getElementById("header_pic");
    headerPicture.style.backgroundColor="#4bb370";

    var index;
    var headerText = document.getElementsByClassName("header_for_graph");
    for (index = 0; index < headerText.length; ++index) {
      headerText[index].style.color ="black";
    }
  });

});


// FUNCTIONAL bar graph that will create a bar graph, filtering stats in descending order
// Produces the Bar Graph based on Stat Selected
function interactivePlot(stat){
var statsDropdown = d3.select(statsList);
var stat = statsDropdown.property("value");
var url2 = `${stat}`
d3.json(url2).then(function(data) {

    console.log(data);

    var PlayerName = data.map(Player => Player["player"]);
    var statQueried = data.map(Player => Player[stat]);
    

    var trace1 = {
        x: PlayerName,
        y: statQueried,
        type: "bar"
      };
      
      var data = [trace1];
      
      var layout = {
        title: "2020/2021 Premier League Top Performers",
        margin: {b:185},
        yaxis: {automargin: true},
        xaxis: {type: 'category'}
      };
      
      var config = {responsive: true};

      Plotly.newPlot("statBarGraph", data, layout, config);
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
        {title: "Team", field: "team"},
        {title: "Nationality", field: "nation"},
        {title: "Position", field: "player_position"},
        {title: "Age", field: "age"},
        {title: "FPL Value", field: "current_price"},
        {title: "FPL Points", field: "total_points"},
        {title: "FPL Points/FPL Value", field: "value_season"},
        {title: "Goals", field: "goals"},
        {title: "Assists", field: "assists"},
        {title: "Selected By (%)", field: "selected_by_percent"},
        {title: "Transferred In (This Week)", field: "transfers_in"},
        {title: "Minutes Played", field: "minutes"},
        {title: "Games Played", field: "games_played"},
        {title: "Games Started", field: "starts"},
        {title: "PKs Scored", field: "penalty_kicks_scored"},
        {title: "PKs Attempted", field: "penalty_kicks_attempted"},
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
        {title: "Team", field: "team"},
        {title: "Nationality", field: "nation"},
        {title: "Position", field: "player_position"},
        {title: "Age", field: "age"},
        {title: "FPL Value", field: "current_price"},
        {title: "FPL Points", field: "total_points"},
        {title: "FPL Points/FPL Value", field: "value_season"},
        {title: "Goals", field: "goals"},
        {title: "Assists", field: "assists"},
        {title: "Selected By (%)", field: "selected_by_percent"},
        {title: "Transferred In (This Week)", field: "transfers_in"},
        {title: "Minutes Played", field: "minutes"},
        {title: "Games Played", field: "games_played"},
        {title: "Games Started", field: "starts"},
        {title: "PKs Scored", field: "penalty_kicks_scored"},
        {title: "PKs Attempted", field: "penalty_kicks_attempted"},
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
  // var buttonPlayer = document.getElementById("playerName");

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

      // Player 1 GK Stats
      var cleanSheet = data[0].map(Player => Player["clean_sheets"]);
      var cleanSheetPercentage = data[0].map(Player => Player["clean_sheet_percentage"]);
      var goalsConceded = data[0].map(Player => Player["goals_against"]);
      var goalsConcededPerMatch = data[0].map(Player => Player["goals_against_per_90"]);
      var pkAttemptAgainst = data[0].map(Player => Player["pk_attempts_against"]);
      var pkSaved = data[0].map(Player => Player["penalty_kicks_saved"]);
      var pkScoredOn = data[0].map(Player => Player["penalty_kicks_scored_on"]);
      var pkMissedAgainst = data[0].map(Player => Player["penalty_kicks_missed"]);
      var gkSaves = data[0].map(Player => Player["saves"]);
      var gkSavePercentage = data[0].map(Player => Player["save_percentage"]);
      var gkShotsOnTargetAgainst = data[0].map(Player => Player["shots_on_target_against"]);

      if(playerPosition1 != "Goalkeeper"){
        var trace1 = {
          x: PlayerName,
          y: totalPoints,
          name: "Total Points",
          type: "bar",
          text: totalPoints.map(String),
          textposition: 'auto'
        };
  
        var trace2 = {
          x: PlayerName,
          y: totalGoals,
          name: "Total Goals Scored",
          type: "bar",
          text: totalGoals.map(String),
          textposition: 'auto'
        };
  
        var trace3 = {
          x: PlayerName,
          y: xGoals,
          name: "Expected Goals",
          type: "bar",
          text: xGoals.map(String),
          textposition: 'auto'
        };
  
        var trace4 = {
          x: PlayerName,
          y: totalAssists,
          name: "Total Assists",
          type: "bar",
          text: totalAssists.map(String),
          textposition: 'auto'
        };
  
        var trace5 = {
          x: PlayerName,
          y: xAssists,
          name: "Expected Assists",
          type: "bar",
          text: xAssists.map(String),
          textposition: 'auto'
        };
  
        var data = [trace1, trace2, trace3, trace4, trace5];
      }

      else{
        var trace1 = {
          x: PlayerName,
          y: totalPoints,
          name: "Total Points",
          type: "bar",
          text: totalPoints.map(String),
          textposition: 'auto'
        };

        var trace2 = {
          x: PlayerName,
          y: gkSaves,
          name: "Total Saves",
          type: "bar",
          text: gkSaves.map(String),
          textposition: 'auto'
        };

        var trace3 = {
          x: PlayerName,
          y: gkSavePercentage,
          name: "Save Percentage",
          type: "bar",
          text: gkSavePercentage.map(String),
          textposition: 'auto'
        };

        var trace4 = {
          x: PlayerName,
          y: gkShotsOnTargetAgainst,
          name: "Shots on Target Against",
          type: "bar",
          text: gkShotsOnTargetAgainst.map(String),
          textposition: 'auto'
        };

        var trace5 = {
          x: PlayerName,
          y: cleanSheet,
          name: "Clean Sheets",
          type: "bar",
          text: cleanSheet.map(String),
          textposition: 'auto'
        };

        var trace6 = {
          x: PlayerName,
          y: cleanSheetPercentage,
          name: "Clean Sheet Percentage",
          type: "bar",
          text: cleanSheetPercentage.map(String),
          textposition: 'auto'
        };

        var trace7 = {
          x: PlayerName,
          y: goalsConceded,
          name: "Goals Conceded",
          type: "bar",
          text: goalsConceded.map(String),
          textposition: 'auto'
        };

        var trace8 = {
          x: PlayerName,
          y: goalsConcededPerMatch,
          name: "Goals Conceded Per 90",
          type: "bar",
          text: goalsConcededPerMatch.map(String),
          textposition: 'auto'
        };

        var trace9 = {
          x: PlayerName,
          y: pkAttemptAgainst,
          name: "Attempted Penalty Kicks Against",
          type: "bar",
          text: pkAttemptAgainst.map(String),
          textposition: 'auto'
        };

        var trace10 = {
          x: PlayerName,
          y: pkSaved,
          name: "Saved Penalty Kicks",
          type: "bar",
          text: pkSaved.map(String),
          textposition: 'auto'
        };

        var trace11 = {
          x: PlayerName,
          y: pkScoredOn,
          name: "Penalty Kicks Scored Against",
          type: "bar",
          text: pkScoredOn.map(String),
          textposition: 'auto'
        };

        var trace12 = {
          x: PlayerName,
          y: pkMissedAgainst,
          name: "Penalty Kicks Missed Against",
          type: "bar",
          text: pkMissedAgainst.map(String),
          textposition: 'auto'
        };

        var data = [trace1, trace2, trace3, trace4, trace5, trace6, trace7, trace8, trace9, trace10, trace11, trace12];
      }

      
      var layout = {
        title: `2020/2021 Premier League Stats: ${PlayerName}`,
        yaxis: {automargin: true},
        xaxis: {type: 'category'},
        // barmode: 'group'
      };

      var config = {responsive: true};
      
      Plotly.newPlot("playerBoxPlot", data, layout, config);
  
  });
});
};

var getPlayerStatsButton = document.getElementById("getPlayerStatsButton");

getPlayerStatsButton.addEventListener("change", filterByPlayer())

                // NEW GRAPH TO COMPARE PLAYERS

// Graphing Function to compare offensive stats of 2 players
function comparePlayers(){
  // var buttonPlayer2 = document.getElementById("comparePlayer2");

  // buttonPlayer2.addEventListener("click", function playersSelected() {
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

      if(playerPosition1 != "Goalkeeper"){
        var yStats = [parseInt(totalPoints1), parseInt(totalGoals1), parseInt(totalAssists1), parseFloat(totalG_plus_A_per90_1), parseFloat(xGoals1), parseFloat(xAssists1) ]
        var trace1 = {
          x: ["Points", "Goals", "Assists", "Goals + Assists per 90", "xGoals", "xAssists"],
          y: yStats,
          name: `${PlayerName1}`,
          type: "bar",
          text: yStats.map(String),
          textposition: 'auto'
        };
      }
      else{
        var yStats= [parseInt(totalPoints1), parseInt(gkSaves1), parseInt(gkSavePercentage1), parseInt(gkShotsOnTargetAgainst1), parseInt(cleanSheet1), parseFloat(cleanSheetPercentage1), parseInt(goalsConceded1), parseFloat(goalsConcededPerMatch1), parseInt(pkAttemptAgainst1), parseInt(pkSaved1), parseInt(pkScoredOn1), parseInt(pkMissedAgainst1)]
        var trace1 = {
          x: ["Points", "Saves", "Save Percentage", "Shots On Target Against","Clean Sheets", "Clean Sheet Percentage", "Goals Conceded", "Goals Per Match", "PKs Attempted Against", "PKs Saved", "PKs Scored Against", "PKs Missed Against"],
          y: yStats,
          name: `${PlayerName1}`,
          type: "bar",
          text: yStats.map(String),
          textposition: 'auto'
        };
      }

      if(playerPosition2 != "Goalkeeper"){
        var yStats = [parseInt(totalPoints2), parseInt(totalGoals2), parseInt(totalAssists2), parseFloat(totalG_plus_A_per90_2), parseFloat(xGoals2), parseFloat(xAssists2)]
        var trace2 = {
          x: ["Points", "Goals", "Assists", "Goals + Assists per 90", "xGoals", "xAssists"],
          y: yStats,
          name: `${PlayerName2}`,
          type: "bar",
          text: yStats.map(String),
          textposition: 'auto'
        };  
      }
      else{
        var yStats = [parseInt(totalPoints2), parseInt(gkSaves2), parseInt(gkSavePercentage2), parseInt(gkShotsOnTargetAgainst2), parseInt(cleanSheet2), parseFloat(cleanSheetPercentage2), parseInt(goalsConceded2), parseFloat(goalsConcededPerMatch2), parseInt(pkAttemptAgainst2), parseInt(pkSaved2), parseInt(pkScoredOn2), parseInt(pkMissedAgainst2)]
        var trace2 = {
          x: ["Points", "Saves", "Save Percentage", "Shots On Target Against","Clean Sheets", "Clean Sheet Percentage", "Goals Conceded", "Goals Per Match", "PKs Attempted Against", "PKs Saved", "PKs Scored Against", "PKs Missed Against"],
          y: yStats,
          name: `${PlayerName2}`,
          type: "bar",
          text: yStats.map(String),
          textposition: 'auto'
        };
      }

      var data = [trace1, trace2];
      
      var layout = {
        title: `2020/2021 Premier League Stats: ${PlayerName1} vs ${PlayerName2}`,
        yaxis: {automargin: true},
        xaxis: {type: 'category'},
        barmode: 'group',
        margin: {b:100},
      };
      
      var config = {responsive: true};
      
      Plotly.newPlot("comparePlayerGraph", data, layout, config);

  });
});
};

var playerComparedFinalButton = document.getElementById("comparePlayersButton");
playerComparedFinalButton.addEventListener("change", comparePlayers());