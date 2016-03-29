
library(shiny)
library(data.table)
library(pander)
shinyServer(function(input, output, session ) {
  varosok_data <- read.csv("varos.csv", header = T, sep = ",", stringsAsFactors = F, fileEncoding = 'UTF-8')
  varosok_data$varos[1] <-""
  varosss <- varosok_data$varos
  
  varosok <- reactive({
    if (g_by()!="" || g_by2()!="" ) {
      return("")
    }else
      return( varosss)
  })
  
    output$varos <- renderUI({
    selectInput("varos", "Szűrés városra (összegzés után szűrés a táblázat alján)",selected = "", choices= varosok() )
  })
  
  d2020 <-data.table( read.csv("eu.csv", header = T,sep = ",", fileEncoding = 'UTF-8'))
  
  
  
  observe({ query <- parseQueryString(session$clientData$url_search) 
    if (!is.null(query[['terv']])) 
      { updateTextInput(session, "f_terv", value = query[['terv']]) } 
    else if (!is.null(query[['varos']]))
      { updateTextInput(session, "varos", value = query[['varos']]) } 
  })
  
  
  by_varos <- reactive({
    as.character(input$varos)
  })
  
  
  g_by <- reactive({
    as.character(input$group_by)
  })
  
  g_by2 <- reactive({
    as.character(input$group_by2)
  })
  prog <- reactive({
    as.character(input$f_terv)
  })
  
  by_varos <- reactive({
    if (g_by()!="" || g_by2()!="" ) {
      return("")
    }else
      return( as.character(input$varos))
  })
  
  
  
  dd <- reactive({
    h<-g_by()
    h2<-g_by2()
    p <- prog()
    v  <-by_varos()
    

  if (v=="") {
      
    
    if (h==""&p=="") {
      return(d2020)
    } else if ( h==""& p!="") {
      return(d2020[f_program==p])
    }else if ( h!=""& p==""&h2=="") {
      return(d2020[,list(millio_Ft=round(sum(millio_Ft, na.rm = T), digits=3), nyertes_palyazatok_szama= .N),by=h])
    }else if ( h!=""& p!=""&h2=="") {
      return(d2020[f_program==p,list(millio_Ft=round(sum(millio_Ft, na.rm = T), digits=3), nyertes_palyazatok_szama= .N),by=h])
    }else if ( h!=""& p!="" &h2!="") {
      return(d2020[f_program==p,list(millio_Ft=round(sum(millio_Ft, na.rm = T), digits=3), nyertes_palyazatok_szama= .N),by=c(h, h2)])
    }else if ( h!=""& p==""&h2!="") {
      return(d2020[,list(millio_Ft=round(sum(millio_Ft, na.rm = T), digits=3), nyertes_palyazatok_szama= .N),by=c(h, h2)])
    }
  }else if (v!="" & p!="") {
      return(d2020[f_program==p & varos==v, ])
    }else if (v!="" & p=="") {
      return(d2020[ varos==v, ])
    }
    
  })

  output$distPlot <- renderDataTable({
    
    dd()
  }, options = list(orderClasses = TRUE, lengthMenu = c(10,50,500,5000, 10000, 25000 ), pageLength = 5))
  
  
  
  output$downloadData <- downloadHandler(
    
    filename = 'data.csv' , content = function(file) {
      
      write.csv(dd(), file,  row.names = FALSE,  fileEncoding = "UTF-8")
    }
  )
  
  
})





