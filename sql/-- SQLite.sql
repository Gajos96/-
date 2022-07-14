           
            -- SELECT * FROM (SELECT ROW_NUMBER() OVER (ORDER BY client.no) AS row
            -- , client , Count(no)
            -- from invoices
            -- Where no client LIKE ?
            -- GROUP BY invoices.client
            -- Order by Count(no)) subq
            -- WHERE subq.row>=2 AND subq.row<=15


            SELECT * FROM ( 
            SELECT ROW_NUMBER() OVER (ORDER BY invoices.no) AS row  
            , invoices.client ,Count(invoices.no) As count1
             from invoices 
            WHERE no LIKE '%' OR client LIKE '%'
             GROUP BY invoices.client  
             Order by Count(invoices.no) desc 
            ) as kro  
            WHERE kro.row>=20 AND kro.row<=30