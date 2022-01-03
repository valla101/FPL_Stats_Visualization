from flask import Flask, jsonify, render_template

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy.sql import text  #ES import text to use SQL text directly
from sqlalchemy import create_engine, func, inspect
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

# FROM HERE DO NOT DELETE

# Connecting to the Postgres Database
engine = create_engine(f'postgres://wbqnbbqkykqdaj:63bf019edf08344171db6162cbfdd7dc8bb288a6068fdb6f029eeb18eb53271c@ec2-3-215-76-208.compute-1.amazonaws.com:5432/ddad815989gh9j')

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Base Class

combined_fpl_2020 = Base.classes.combined_table

match_stats = Base.classes.match_logs


# Creating Flask Application
app = Flask(__name__)

# Route 1
@app.route("/")
def home_route_function():
    inspector = inspect(engine)

    stats_list = inspector.get_columns('combined_table')[4:50]

    clean_stats_list = [
    "Age",
    "Games Played",
    "Games Started",
    "Total FPL Points",
    "Minutes Played",
    "Selected By Percent",
    "Current FPL Price",
    "Transfers In (This Gameweek)",
    "FPL Points/FPL Value",
    "Goals Scored",
    "Assists",
    "Total Shots",
    "Shots on Target",
    "Shots on Target Percentage",
    "Total Shots Per 90",
    "Shots On Target Per 90",
    "Average Shot Distance",
    "Free Kick Shots",
    "Penalty Kicks Scored",
    "Penalty Kicks Attempted",
    "Yellow Cards",
    "Red Cards",
    "Goals Per 90",
    "Assists Per 90",
    "Goals + Assists Per 90",
    "Goals - Penalty Kicks Per 90",
    "Goals + Assists - Penalty Kicks Per 90",
    "Expected Goals",
    "Non Penalty Expected Goals",
    "Expected Assists",
    "Expected Goals Per 90",
    "Expected Assists Per 90",
    "Expected Goals + Expected Assists Per 90",
    "Non Penalty Expected Goals Per 90",
    "Non Penalty Expected Goals + Expected Assists Per 90",
    "Goals Against",
    "Goals Against Per 90",
    "Shots On Target Against",
    "Saves",
    "Save Percentage",
    "Clean Sheets",
    "Clean Sheet Percentage",
    "Penalty Kicks Against",
    "Penalty Kicks Scored Against",
    "Penalty Kicks Saved",
    "Penalty Kicks Missed Against"
    ]

    zipped_columns = zip(stats_list, clean_stats_list)
    zipped_columns2 = zip(stats_list, clean_stats_list)
    
    # Working Query Using SQLAlchemy Classes
    session = Session(engine)

    # Query used to call all players in the table
    query_player = session.query(combined_fpl_2020.player).order_by(combined_fpl_2020.player.asc()).all()

    # Query Matchweek 
    query_matchweek = session.query(match_stats.gameweek).order_by(match_stats.gameweek.asc()).distinct()

    # Query used to call all teams in the table
    teams = session.query(combined_fpl_2020.team_id).order_by(combined_fpl_2020.team_id.asc()).distinct()
    connection = engine.connect()
    query_fpl_positions = connection.execute("select distinct player_position from combined_table")

    return render_template('index.html', query_player = query_player, query_fpl_positions = query_fpl_positions, zipped_columns = zipped_columns, zipped_columns2= zipped_columns2, teams = teams, query_matchweek=query_matchweek)

# Route for Player Match Form Comparison
@app.route("/query_match_stats_players/<player1>/<player2>/<gameweek_start>/<gameweek_end>")
def match_stat_player(player1, player2, gameweek_start, gameweek_end):
    
    connection = engine.connect()

    session = Session(engine)

    query_fpl_view = connection.execute(f"select * from match_logs where match_logs.player='{player1}' and match_logs.gameweek>={gameweek_start} and match_logs.gameweek<={gameweek_end}", player=player1, gameweek = gameweek_start)

    query_fpl_view2 = connection.execute(f"select * from match_logs where match_logs.player='{player2}' and match_logs.gameweek>={gameweek_start} and match_logs.gameweek<={gameweek_end}", player=player2, gameweek = gameweek_start)

    session.close()

    return jsonify([dict(row) for row in query_fpl_view], [dict(row) for row in query_fpl_view2])

@app.route("/query_all_players/<player>")
def player_route(player):
    connection = engine.connect()

    session = Session(engine)

    query_fpl_view = connection.execute(f"select * from combined_table where combined_table.player='{player}'", player=player)

    session.close()

    return jsonify([dict(row) for row in query_fpl_view])

# Querying all keys based on price filter
@app.route("/query_by_value/<price>")
def filter_by_price(price):
    connection = engine.connect()

    query_player_price_limit = connection.execute(f"select * from combined_table where current_price <='{price}' order by current_price desc, total_points desc", price = price)

    return jsonify([dict(row) for row in query_player_price_limit])

# ROUTE TO QUERY 2 PLAYERS SIMULTANEOUSLY
@app.route("/query_all_players/<player1>/<player2>")
def compare_players_route(player1, player2):
    connection = engine.connect()

    session = Session(engine)

    query_fpl_view1 = connection.execute(f"select * from combined_table where combined_table.player='{player1}'", player=player1)

    query_fpl_view2 = connection.execute(f"select * from combined_table where combined_table.player='{player2}'", player=player2)

    session.close()

    return jsonify([dict(row) for row in query_fpl_view1], [dict(row) for row in query_fpl_view2])

# ROUTE TO QUERY PLAYERS BY POSITION
@app.route("/query_by_position/<position>")
def filter_by_position(position):
    connection = engine.connect()

    query_player_position = connection.execute(f"select * from combined_table where player_position = '{position}' order by total_points desc", position = position)

    return jsonify([dict(row) for row in query_player_position])

# Querying player & requested stat in order by descending. Used for interactive bar graph
@app.route("/<stat>/<limit>")
def top_10(stat, limit):
    connection = engine.connect()

    top_10_result = connection.execute(f"select player, {stat} from combined_table where {stat} is not null order by {stat} desc limit({limit})")

    return jsonify([dict(row) for row in top_10_result])


# Creating a route to extract an individual player's stat
@app.route("/query_player_stat/<player>/<stat>/")
def player_stat(player, stat):
    connection = engine.connect()

    stat_query_result = connection.execute(f"select player, {stat} from combined_table where combined_table.player = '{player}'", player=player)

    return jsonify([dict(row) for row in stat_query_result])

# Creating a route to extract all players' stat. Used for Scatter Plot
@app.route("/query_all_player_stat/<stat>")
def all_stat(stat):
    connection = engine.connect()

    all_players_stat = connection.execute(f"select player, {stat}, minutes from combined_table where {stat} is not null")

    return jsonify([dict(row) for row in all_players_stat])

# Creating a route to query team's players based on a queried stat. Used for Scatter Plot
@app.route("/query_all_player_stat/<stat>/<team>")
def test_bar_graph(stat, team):
    connection = engine.connect()
    all_players_stat2 = connection.execute(f"select player, team_id, {stat}, minutes from combined_table where {stat} is not null and team_id = '{team}'", team=team)
    return jsonify([dict(row) for row in all_players_stat2])

# Creating a route to query all players in 1 position based on player input
@app.route("/query_all_player_position/<player1>")
def test_position_query(player1):
    connection = engine.connect()
    query_fpl_view1 = connection.execute(f"select * from combined_table where combined_table.player='{player1}'", player=player1)

    for row in query_fpl_view1:
        # Query for Expensive Forwards above 8.0 price range
        if row.player_position == "Forward" and row.current_price >= 8.0:
            session = Session(engine)
            # performs query on current season's stats for specific player
            player_chosen = connection.execute(f"select * from combined_table where combined_table.player='{player1}'", player=player1)
            # performs query on last season's stats based on specific player's price range and FPL position
            forwards_old = connection.execute(f"select * from combined_table_20_21 where combined_table_20_21.player_position='Forward' and combined_table_20_21.current_price >= 8.0")


            session.close()
            return jsonify([dict(row) for row in player_chosen],[dict(row) for row in forwards_old])
        
        # Query for Mid Range Forwards from 6.0 - 8.0 price range
        if row.player_position == "Forward" and (6.0 <= row.current_price < 8.0):
            session = Session(engine)
            # performs query on current season's stats for specific player
            player_chosen = connection.execute(f"select * from combined_table where combined_table.player='{player1}'", player=player1)
            # performs query on last season's stats based on specific player's price range and FPL position
            forwards_old = connection.execute(f"select * from combined_table_20_21 where combined_table_20_21.player_position='Forward' and combined_table_20_21.current_price >= 6.0 and combined_table_20_21.current_price < 8.0")


            session.close()
            return jsonify([dict(row) for row in player_chosen],[dict(row) for row in forwards_old])

        # Query for Cheap Forwards from 4.0 - 5.9 price range
        if row.player_position == "Forward" and (4.0 <= row.current_price < 6.0):
            session = Session(engine)

            # performs query on current season's stats for specific player
            player_chosen = connection.execute(f"select * from combined_table where combined_table.player='{player1}'", player=player1)
            # performs query on last season's stats based on specific player's price range and FPL position
            forwards_old = connection.execute(f"select * from combined_table_20_21 where combined_table_20_21.player_position='Forward' and combined_table_20_21.current_price >= 4.0 and combined_table_20_21.current_price < 6.0")


            session.close()
            return jsonify([dict(row) for row in player_chosen],[dict(row) for row in forwards_old])
        
        # Query for Expensive Midfielders above 8.0 price range
        if row.player_position == "Midfielder" and row.current_price >= 8.0:
            session = Session(engine)

            # performs query on current season's stats for specific player
            player_chosen = connection.execute(f"select * from combined_table where combined_table.player='{player1}'", player=player1)
            # performs query on last season's stats based on specific player's price range and FPL position
            mids_old = connection.execute(f"select * from combined_table_20_21 where combined_table_20_21.player_position='Midfielder' and combined_table_20_21.current_price >= 8.0")


            session.close()
            return jsonify([dict(row) for row in player_chosen],[dict(row) for row in mids_old])

        # Query for Mid Range Midfielders from 6.0 - 8.0 price range
        if row.player_position == "Midfielder" and (6.0 <= row.current_price < 8.0):
            session = Session(engine)

            # performs query on current season's stats for specific player
            player_chosen = connection.execute(f"select * from combined_table where combined_table.player='{player1}'", player=player1)
            # performs query on last season's stats based on specific player's price range and FPL position
            mids_old = connection.execute(f"select * from combined_table_20_21 where combined_table_20_21.player_position='Midfielder' and combined_table_20_21.current_price >= 6.0 and combined_table_20_21.current_price < 8.0")


            session.close()
            return jsonify([dict(row) for row in player_chosen],[dict(row) for row in mids_old])

        # Query for Mid Range Midfielders from 4.0 - 5.9 price range
        if row.player_position == "Midfielder" and (4.0 <= row.current_price < 6.0):
            session = Session(engine)

            # performs query on current season's stats for specific player
            player_chosen = connection.execute(f"select * from combined_table where combined_table.player='{player1}'", player=player1)
            # performs query on last season's stats based on specific player's price range and FPL position
            mids_old = connection.execute(f"select * from combined_table_20_21 where combined_table_20_21.player_position='Midfielder' and combined_table_20_21.current_price >= 4.0 and combined_table_20_21.current_price < 6.0")


            session.close()
            return jsonify([dict(row) for row in player_chosen],[dict(row) for row in mids_old])    
        
        # Query for Expensive Defenders from and above 5.5 price range
        if row.player_position == "Defender" and row.current_price >= 5.5:
            session = Session(engine)

            # performs query on current season's stats for specific player
            player_chosen = connection.execute(f"select * from combined_table where combined_table.player='{player1}'", player=player1)
            # performs query on last season's stats based on specific player's price range and FPL position
            defenders_old = connection.execute(f"select * from combined_table_20_21 where combined_table_20_21.player_position='Defender' and combined_table_20_21.current_price >= 5.5")


            session.close()
            return jsonify([dict(row) for row in player_chosen],[dict(row) for row in defenders_old])

        # Query for Expensive Defenders from 4.5 - 5.4 price range
        if row.player_position == "Defender" and (4.5 <= row.current_price < 5.5):
            session = Session(engine)

            # performs query on current season's stats for specific player
            player_chosen = connection.execute(f"select * from combined_table where combined_table.player='{player1}'", player=player1)
            # performs query on last season's stats based on specific player's price range and FPL position
            defenders_old = connection.execute(f"select * from combined_table_20_21 where combined_table_20_21.player_position='Defender' and combined_table_20_21.current_price >= 4.5 and combined_table_20_21.current_price < 5.5")


            session.close()
            return jsonify([dict(row) for row in player_chosen],[dict(row) for row in defenders_old])

        # Query for Expensive Defenders from 4.5 - 5.4 price range
        if row.player_position == "Defender" and row.current_price < 4.5:
            session = Session(engine)

            # performs query on current season's stats for specific player
            player_chosen = connection.execute(f"select * from combined_table where combined_table.player='{player1}'", player=player1)
            # performs query on last season's stats based on specific player's price range and FPL position
            defenders_old = connection.execute(f"select * from combined_table_20_21 where combined_table_20_21.player_position='Defender' and combined_table_20_21.current_price < 4.5")


            session.close()
            return jsonify([dict(row) for row in player_chosen],[dict(row) for row in defenders_old])

# Define main behavior
if __name__ == "__main__":
    app.run(debug=True)