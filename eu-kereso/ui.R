#
#    EU Palyazat Kereso
#    Copyright (C) 2016, Orsos Mihaly
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as published
#    by the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#

# This is the user-interface definition of a Shiny web application.
# You can find out more about building applications with Shiny here:
#
# http://shiny.rstudio.com
#

library(shiny)

shinyUI(fluidPage(

  # Application title
 titlePanel("Erre költötte Magyarország az EU-s pénzeket"),

  # Sidebar with a slider input for number of bins
  sidebarLayout(
    sidebarPanel(
      selectInput("f_terv", label = "Fejlesztési programok", choices = c("", "EU 2007-2013"="eu_2007_2013", "Kutatási, Technológiai és Innovációs Alap"= "ktia", "Széchenyi 2020"= "szechenyi", "Új Széchenyi Terv" = "uszt", "Nemzeti Fejlesztési Terv"="nft"), selected = ""),
      uiOutput("varos"),
      selectInput("group_by", label = "Összegzés", choices = c("","Nyertes"="nyertes", "Város"= "varos", "Forrás"= "forras", "Év" = "ev",
                                                               "Jogállás" ="jogalas", "Megye"= "megye", "Kistérség"="kisterseg", "Hátrányos besorolás"= "hatranyos"), selected = ""),
      selectInput("group_by2", label = "További összegzés", choices = c("","Nyertes"="nyertes", "Város"= "varos", "Forrás"= "forras", "Év" = "ev",
                                                                        "Jogállás" ="jogalas", "Megye"= "megye", "Kistérség"="kisterseg", "Hátrányos besorolás"= "hatranyos"), selected = ""),
      downloadButton("downloadData","Letöltés"),
      
      br(),
      tags$div(class="header", checked=NA,
               tags$p(h4("Az oldalt kitalálta és elkészítette")),
               tags$a(href="http://orsosmihaly.com", "Orsós Mihály"), style="text-align: center;"),
      
      
      tags$div(class="container-fluid",  style="text-align: center;"),
      
      br(), br(),
      tags$div(class="header", checked=NA,
               tags$p(h4("Az adatok forrása")),
               tags$a(href="http://eupalyazatiportal.hu/nyertes_palyazatok/", "eupalyazatiportal.hu"),style="text-align: center;")
      
      
  
    ),

    # Show a plot of the generated distribution
    mainPanel(
      
    
      dataTableOutput("distPlot")
      
      
    )
  )
))
