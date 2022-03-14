=> WP 0: architecture problems in current implementation

# Grouping
The theory is we ask the BE for a normal SSP query but with a grouping parameter
This grouping parameter will calculate "artificial" activities on the backend and return them
=> WP 1: calculate artificial week pattern activities based on grouping parameter

# Storing in the redux state
Now, it gets a little bit tricker with this grouping;
a) it may not contain data on the same format
b) one will want to see both the grouped activities, as well as the contents of the group

In other word, we need to be able to keep two different data types in the state at the same time,
all while also doing SSP on BOTH collections
=> WP 2: design adn figure out how this should work

=> WP 3: the table

=> WP 4: the interactions with the table