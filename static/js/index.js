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
          
          Plotly.newPlot("statBarGraph", data, layout);
      });
    };
// FUNCTION END
    
    
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
// FUNCTION END
  
var button = document.getElementById("priceFilterButton");

button.addEventListener("click", filterByPrice())


// Route for Player Offensive Stats. Generates a Bar Graph

function filterByPlayer(){
    var buttonPlayer = document.getElementById("playerName");
  
    buttonPlayer.addEventListener("click", function playerSelected() {
  
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
  
        var trace1 = {
          x: PlayerName,
          y: totalPoints,
          name: "Total Points",
          type: "bar",
          // text: totalPoints
        };
  
        var trace2 = {
          x: PlayerName,
          y: totalGoals,
          name: "Total Goals Scored",
          type: "bar",
          // text: totalGoals
        };
  
        var trace3 = {
          x: PlayerName,
          y: xGoals,
          name: "Expected Goals",
          type: "bar",
          // text: xGoals
        };
  
        var trace4 = {
          x: PlayerName,
          y: totalAssists,
          name: "Total Assists",
          type: "bar",
          // text: totalAssists
        };
  
        var trace5 = {
          x: PlayerName,
          y: xAssists,
          name: "Expected Assists",
          type: "bar",
          // text: xAssists
        };
  
        var data = [trace1, trace2, trace3, trace4, trace5];
        
        var layout = {
          title: "2020/2021 Premier League",
          yaxis: {automargin: true},
          xaxis: {type: 'category'},
          // barmode: 'group'
        };
        
        Plotly.newPlot("playerBoxPlot", data, layout);
    
    });
  });
  };
// FUNCTION END

var playerDropdownButton = document.getElementById("priceFilterButton");

playerDropdownButton.addEventListener("change", filterByPlayer())


// Graphing Function to compare offensive stats of 2 players
function comparePlayers(){
    var buttonPlayer2 = document.getElementById("comparePlayer2");
  
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
  
        // Compare Player 2
        var PlayerName2 = data[1].map(Player => Player["player"]);
        var totalPoints2 = data[1].map(Player => Player["total_points"]);
        var totalGoals2 = data[1].map(Player => Player["goals"]);
        var totalAssists2 = data[1].map(Player => Player["assists"]);
        var totalG_plus_A_per90_2 = data[1].map(Player => Player["goals_plus_assists_per_90"]);
        var xGoals2 = data[1].map(Player => Player["expected_goals"]);
        var xAssists2 = data[1].map(Player => Player["expected_assists"]);
  
        var trace1 = {
          x: ["Points", "Goals", "Assists", "Goals + Assists per 90", "xGoals", "xAssists"],
          y: [parseInt(totalPoints1), parseInt(totalGoals1), parseInt(totalAssists1), parseFloat(totalG_plus_A_per90_1), parseFloat(xGoals1), parseFloat(xAssists1) ],
          name: `${PlayerName1}`,
          type: "bar",
        };
  
        var trace2 = {
          x: ["Points", "Goals", "Assists", "Goals + Assists per 90", "xGoals", "xAssists"],
          y: [parseInt(totalPoints2), parseInt(totalGoals2), parseInt(totalAssists2), parseFloat(totalG_plus_A_per90_2), parseFloat(xGoals2), parseFloat(xAssists2) ],
          name: `${PlayerName2}`,
          type: "bar",
        };
  
        var data = [trace1, trace2];
        
        var layout = {
          title: `2020/2021 Premier League Stats: ${PlayerName1} vs ${PlayerName2}`,
          yaxis: {automargin: true},
          xaxis: {type: 'category'},
          barmode: 'group'
        };
        
        Plotly.newPlot("comparePlayerGraph", data, layout);
  
        
    
    });
  });
  };
// FUNCTION END

var playerCompared2 = document.getElementById("comparePlayer2");

playerCompared2.addEventListener("change", comparePlayers())
  