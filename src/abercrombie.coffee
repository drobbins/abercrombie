# About this Module
version = "0.0.1"
id      = "abercrombie"

# Say Hello
imagejs.msg "#{id} version #{version} loaded."

# Create the Menu
name = "Abercrombie (#{version})"
menu =
    "Start": -> imagejs.msg "You started something good."
jmat.gId("menu").appendChild imagejs.menu menu, name