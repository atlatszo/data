# EU tamogatasok terkepen

How to:

1. Provide the following variables in the config.py:<br/>
    username = "your_MySQL_username"<br/>
    password = "your_MySQL_password"<br/>
    database = "localhost/yourdatabase_name"

2. Provide a secure secret_key in application.py:<br/>
    app.secret_key = "your_secret_key"

3. Run populate_cities.py

Working demo:

http://adat.atlatszo.hu/eu-terkep

You can query cities like so:
http://adat.atlatszo.hu/eu-terkep?telepules=Szeged&view=3&year=2008


license:

    EU tamogatasok terkep
    Copyright (C) 2016 Krich Balazs

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

