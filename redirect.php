#!/usr/bin/php
<?php

$temp = array();

// Extend stream timeout to 24 hours
stream_set_timeout(STDIN, 86400);

while ( $input = fgets(STDIN) ) {
  // Split the output (space delimited) from squid into an array.
  $temp = split(' ', $input);

  // Set the URL from squid to a temporary holder.
  $output = $temp[0] . "\n";

  // Check the URL and rewrite it if it matches foo.example.com
  
    $output = "302:http://www.localhost:3000/\n";
  
  echo $output;
}
