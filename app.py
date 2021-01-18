from flask import Flask, jsonify, render_template

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy.sql import text  #ES import text to use SQL text directly
from sqlalchemy import create_engine, func, inspect

# Connecting to the Postgres Database
engine = create_engine(f'postgres://wbqnbbqkykqdaj:63bf019edf08344171db6162cbfdd7dc8bb288a6068fdb6f029eeb18eb53271c@ec2-3-215-76-208.compute-1.amazonaws.com:5432/ddad815989gh9j')

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Base Class
# stats_pl_2019 = Base.classes.pl_2019

combined_fpl_2020 = Base.classes.combined_fpl_table_test_gk2


# Creating Flask Application
app = Flask(__name__)

# Route 1
@app.route("/")
def home_route_function():
    inspector = inspect(engine)

    stats_list = inspector.get_columns('combined_fpl_table_test_gk2')

    clean_stats_list = ["Player",
    "Nationality",
    "Team",
    "Player Position",
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
    "Season"]

    # zipped_columns = zip(stats_list, clean_stats_list)
    
    # Working Query Using SQLAlchemy Classes
    session = Session(engine)

    query_player = session.query(combined_fpl_2020.player).order_by(combined_fpl_2020.total_points.desc()).all()

    connection = engine.connect()
    query_fpl_positions = connection.execute("select distinct player_position from combined_fpl_table_test_gk2")

    # session.query(combined_fpl_2020.player_positon).order_by(combined_fpl_2020.total_points.desc()).all()
    return render_template('index.html', query_player = query_player, query_fpl_positions = query_fpl_positions)
    #  zipped_columns = zipped_columns,
# TESTING ROUTES FROM HERE TO BOTTOM

# Testing Route

@app.route("/query_all_players/<player>")
def player_route(player):
    connection = engine.connect()

    session = Session(engine)

    query_fpl_view = connection.execute(f"select * from combined_fpl_table2 where combined_fpl_table2.player='{player}'", player=player)

    session.close()

    return jsonify([dict(row) for row in query_fpl_view])


    # for query in query_fpl_view: 
    #     print(query)

    # all_rows = []
    # for player, nation, team, age, games_played, starts, total_points, minutes, selected_by_percent, current_price,transfers_in, value_season, Goals, Assists, Penalty_Kicks_Scored, Penalty_Kicks_Attempted, Yellow_Cards, Red_Cards, Goals_Per_90, Assists_Per_90, Goals_Plus_Assists_Per_90, Goals_Minus_Penalty_Kicks_Per_90, Goals_Plus_Assists_Minus_Penalty_Kicks_Per_90, Expected_Goals, Non_Penalty_Expected_Goals, Expected_Assists, Expected_Goals_Per_90, Expected_Assists_Per_90, Expected_Goals_Plus_Expected_Assists_Per_90, Non_Penalty_Expected_Goals_Per_90, Non_Penalty_Expected_Goals_Plus_Expected_Assists_Per_90, Season in query_fpl_view:
    # # for player in query_player:
    #     test_dict = {}
    #     test_dict["player"] = player
    #     test_dict["nation"] = nation
    #     test_dict["team"] = team
    #     test_dict["age"] = age
    #     test_dict["games_played"] = games_played
    #     test_dict["starts"] = starts
    #     test_dict["total_points"] = total_points
    #     test_dict["minutes"] = minutes
    #     test_dict["selected_by_percent"] = selected_by_percent
    #     test_dict["current_price"] = current_price
    #     test_dict["transfers_in"] = transfers_in
    #     test_dict["value_season"] = value_season
    #     test_dict["Goals"] = Goals
    #     test_dict["Assists"] = Assists
    #     test_dict["Penalty_Kicks_Scored"] = Penalty_Kicks_Scored
    #     test_dict["Penalty_Kicks_Attempted"] = Penalty_Kicks_Attempted
    #     test_dict["Yellow_Cards"] = Yellow_Cards
    #     test_dict["Red_Cards"] = Red_Cards
    #     test_dict["Goals_Per_90"] = Goals_Per_90
    #     test_dict["Assists_Per_90"] = Assists_Per_90
    #     test_dict["Goals_Plus_Assists_Per_90"] = Goals_Plus_Assists_Per_90
    #     test_dict["Goals_Minus_Penalty_Kicks_Per_90"] = Goals_Minus_Penalty_Kicks_Per_90
    #     test_dict["Goals_Plus_Assists_Minus_Penalty_Kicks_Per_90"] = Goals_Plus_Assists_Minus_Penalty_Kicks_Per_90
    #     test_dict["Expected_Goals"] = Expected_Goals
    #     test_dict["Non_Penalty_Expected_Goals"] = Non_Penalty_Expected_Goals
    #     test_dict["Expected_Assists"] = Expected_Assists
    #     test_dict["Expected_Goals_Per_90"] = Expected_Goals_Per_90
    #     test_dict["Expected_Assists_Per_90"] = Expected_Assists_Per_90
    #     test_dict["Expected_Goals_Plus_Expected_Assists_Per_90"] = Expected_Goals_Plus_Expected_Assists_Per_90
    #     test_dict["Non_Penalty_Expected_Goals_Per_90"] = Non_Penalty_Expected_Goals_Per_90
    #     test_dict["Non_Penalty_Expected_Goals_Plus_Expected_Assists_Per_90"] = Non_Penalty_Expected_Goals_Plus_Expected_Assists_Per_90
    #     test_dict["Season"] = Season
        

    #     all_rows.append(test_dict)
    # unique_player = list(np.ravel(query_fpl_view))

    # return jsonify(all_rows) 

# Querying player & requested stat in order by descending. Used for interactive bar graph
@app.route("/<stat>")
def stat_testing(stat):
    connection = engine.connect()

    result = connection.execute(f"select player, {stat} from combined_fpl_table_test_gk2 order by {stat} desc")
    # for record in result:
    #     print(record)
    return jsonify([dict(row) for row in result])

# Querying all keys based on price filter
@app.route("/query_by_value/<price>")
def filter_by_price(price):
    connection = engine.connect()

    query_player_price_limit = connection.execute(f"select * from combined_fpl_table_test_gk2 where current_price <='{price}' order by current_price desc, total_points desc", price = price)

    return jsonify([dict(row) for row in query_player_price_limit])

# ROUTE TO QUERY 2 PLAYERS SIMULTANEOUSLY
@app.route("/query_all_players/<player1>/<player2>")
def compare_players_route(player1, player2):
    connection = engine.connect()

    session = Session(engine)

    # query_fpl_view1 = connection.execute(f"select * from combined_fpl_table2 where combined_fpl_table2.player='{player1}'", player=player1)

    # query_fpl_view2 = connection.execute(f"select * from combined_fpl_table2 where combined_fpl_table2.player='{player2}'", player=player2)

    query_fpl_view1 = connection.execute(f"select * from combined_fpl_table_test_gk2 where combined_fpl_table_test_gk2.player='{player1}'", player=player1)

    query_fpl_view2 = connection.execute(f"select * from combined_fpl_table_test_gk2 where combined_fpl_table_test_gk2.player='{player2}'", player=player2)

    session.close()

    return jsonify([dict(row) for row in query_fpl_view1], [dict(row) for row in query_fpl_view2])

# ROUTE TO QUERY PLAYERS BY POSITION
@app.route("/query_by_position/<position>")
def filter_by_position(position):
    connection = engine.connect()

    query_player_position = connection.execute(f"select * from combined_fpl_table_test_gk2 where player_position = '{position}' order by total_points desc", position = position)

    return jsonify([dict(row) for row in query_player_position])

# Define main behavior
if __name__ == "__main__":
    app.run(debug=True)