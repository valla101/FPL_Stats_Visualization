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
# stats_pl_2019 = Base.classes.pl_2019

combined_fpl_2020 = Base.classes.combined_table


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

    query_player = session.query(combined_fpl_2020.player).order_by(combined_fpl_2020.player.asc()).all()

    connection = engine.connect()
    query_fpl_positions = connection.execute("select distinct player_position from combined_table")

    return render_template('index.html', query_player = query_player, query_fpl_positions = query_fpl_positions, zipped_columns = zipped_columns, zipped_columns2= zipped_columns2)
# TESTING ROUTES FROM HERE TO BOTTOM

# Testing Route

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
    # for record in result:
    #     print(record)
    return jsonify([dict(row) for row in top_10_result])

                    # --------------
                    # Testing Routes

# Creating a route to extract an individual player's stat
@app.route("/query_player_stat/<player>/<stat>/")
def player_stat(player, stat):
    connection = engine.connect()

    stat_query_result = connection.execute(f"select player, {stat} from combined_table where combined_table.player = '{player}'", player=player)
    # for record in result:
    #     print(record)
    return jsonify([dict(row) for row in stat_query_result])

# Creating a route to extract all players' stat
@app.route("/query_all_player_stat/<stat>")
def all_stat(stat):
    connection = engine.connect()

    all_players_stat = connection.execute(f"select player, {stat}, minutes from combined_table where {stat} is not null")
    # for record in result:
    #     print(record)
    return jsonify([dict(row) for row in all_players_stat])

# # Testing Route
# @app.route("/query_all_player_stat/<stat>/<order>")
# def test_bar_graph(stat, order):
#     connection = engine.connect()

#     if order == "desc":
#         all_players_stat = connection.execute(f"select player, {stat}, minutes from combined_table where {stat} is not null order by {stat} {order}")
#     if order == "asc":
#         all_players_stat = connection.execute(f"select player, {stat}, minutes from combined_table where {stat} is not null order by {stat} {order}")
#     # for record in result:
#     #     print(record)
#     return jsonify([dict(row) for row in all_players_stat])

# Define main behavior
if __name__ == "__main__":
    app.run(debug=True)