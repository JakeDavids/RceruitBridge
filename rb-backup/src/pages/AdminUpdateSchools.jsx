
import React, { useState, useEffect } from "react";
import { School } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const SCHOOL_MAPPINGS = {
  // FBS Schools
  "Air Force": "Air Force Falcons (United States Air Force Academy)",
  "United States Air Force Academy": "Air Force Falcons (United States Air Force Academy)",
  "Akron": "Akron Zips (University of Akron)",
  "University of Akron": "Akron Zips (University of Akron)",
  "Alabama": "Alabama Crimson Tide (University of Alabama)",
  "University of Alabama": "Alabama Crimson Tide (University of Alabama)",
  "Appalachian State": "Appalachian State Mountaineers (Appalachian State University)",
  "Appalachian State University": "Appalachian State Mountaineers (Appalachian State University)",
  "Arizona": "Arizona Wildcats (University of Arizona)",
  "University of Arizona": "Arizona Wildcats (University of Arizona)",
  "Arizona State": "Arizona State Sun Devils (Arizona State University)",
  "Arizona State University": "Arizona State Sun Devils (Arizona State University)",
  "Arkansas": "Arkansas Razorbacks (University of Arkansas)",
  "University of Arkansas": "Arkansas Razorbacks (University of Arkansas)",
  "Arkansas State": "Arkansas State Red Wolves (Arkansas State University)",
  "Arkansas State University": "Arkansas State Red Wolves (Arkansas State University)",
  "Army": "Army Black Knights (United States Military Academy)",
  "United States Military Academy": "Army Black Knights (United States Military Academy)",
  "Auburn": "Auburn Tigers (Auburn University)",
  "Auburn University": "Auburn Tigers (Auburn University)",
  "Ball State": "Ball State Cardinals (Ball State University)",
  "Ball State University": "Ball State Cardinals (Ball State University)",
  "Baylor": "Baylor Bears (Baylor University)",
  "Baylor University": "Baylor Bears (Baylor University)",
  "Boise State": "Boise State Broncos (Boise State University)",
  "Boise State University": "Boise State Broncos (Boise State University)",
  "Boston College": "Boston College Eagles (Boston College)",
  "Bowling Green": "Bowling Green Falcons (Bowling Green State University)",
  "Bowling Green State University": "Bowling Green Falcons (Bowling Green State University)",
  "Buffalo": "Buffalo Bulls (University at Buffalo)",
  "University at Buffalo": "Buffalo Bulls (University at Buffalo)",
  "BYU": "BYU Cougars (Brigham Young University)",
  "Brigham Young University": "BYU Cougars (Brigham Young University)",
  "California": "California Golden Bears (University of California, Berkeley)",
  "University of California, Berkeley": "California Golden Bears (University of California, Berkeley)",
  "Central Michigan": "Central Michigan Chippewas (Central Michigan University)",
  "Central Michigan University": "Central Michigan Chippewas (Central Michigan University)",
  "Charlotte": "Charlotte 49ers (University of North Carolina at Charlotte)",
  "University of North Carolina at Charlotte": "Charlotte 49ers (University of North Carolina at Charlotte)",
  "Cincinnati": "Cincinnati Bearcats (University of Cincinnati)",
  "University of Cincinnati": "Cincinnati Bearcats (University of Cincinnati)",
  "Clemson": "Clemson Tigers (Clemson University)",
  "Clemson University": "Clemson Tigers (Clemson University)",
  "Coastal Carolina": "Coastal Carolina Chanticleers (Coastal Carolina University)",
  "Coastal Carolina University": "Coastal Carolina Chanticleers (Coastal Carolina University)",
  "Colorado": "Colorado Buffaloes (University of Colorado Boulder)",
  "University of Colorado Boulder": "Colorado Buffaloes (University of Colorado Boulder)",
  "Colorado State": "Colorado State Rams (Colorado State University)",
  "Colorado State University": "Colorado State Rams (Colorado State University)",
  "Connecticut": "Connecticut Huskies (University of Connecticut)",
  "University of Connecticut": "Connecticut Huskies (University of Connecticut)",
  "Duke": "Duke Blue Devils (Duke University)",
  "Duke University": "Duke Blue Devils (Duke University)",
  "East Carolina": "East Carolina Pirates (East Carolina University)",
  "East Carolina University": "East Carolina Pirates (East Carolina University)",
  "Eastern Michigan": "Eastern Michigan Eagles (Eastern Michigan University)",
  "Eastern Michigan University": "Eastern Michigan Eagles (Eastern Michigan University)",
  "FIU": "FIU Panthers (Florida International University)",
  "Florida International University": "FIU Panthers (Florida International University)",
  "Florida": "Florida Gators (University of Florida)",
  "University of Florida": "Florida Gators (University of Florida)",
  "Florida Atlantic": "Florida Atlantic Owls (Florida Atlantic University)",
  "Florida Atlantic University": "Florida Atlantic Owls (Florida Atlantic University)",
  "Florida State": "Florida State Seminoles (Florida State University)",
  "Florida State University": "Florida State Seminoles (Florida State University)",
  "Fresno State": "Fresno State Bulldogs (California State University, Fresno)",
  "California State University, Fresno": "Fresno State Bulldogs (California State University, Fresno)",
  "Georgia": "Georgia Bulldogs (University of Georgia)",
  "University of Georgia": "Georgia Bulldogs (University of Georgia)",
  "Georgia Southern": "Georgia Southern Eagles (Georgia Southern University)",
  "Georgia Southern University": "Georgia Southern Eagles (Georgia Southern University)",
  "Georgia State": "Georgia State Panthers (Georgia State University)",
  "Georgia State University": "Georgia State Panthers (Georgia State University)",
  "Georgia Tech": "Georgia Tech Yellow Jackets (Georgia Institute of Technology)",
  "Georgia Institute of Technology": "Georgia Tech Yellow Jackets (Georgia Institute of Technology)",
  "Hawaii": "Hawaii Rainbow Warriors (University of Hawai'i at Mānoa)",
  "University of Hawai'i at Mānoa": "Hawaii Rainbow Warriors (University of Hawai'i at Mānoa)",
  "Houston": "Houston Cougars (University of Houston)",
  "University of Houston": "Houston Cougars (University of Houston)",
  "Illinois": "Illinois Fighting Illini (University of Illinois Urbana-Champaign)",
  "University of Illinois Urbana-Champaign": "Illinois Fighting Illini (University of Illinois Urbana-Champaign)",
  "Indiana": "Indiana Hoosiers (Indiana University Bloomington)",
  "Indiana University Bloomington": "Indiana Hoosiers (Indiana University Bloomington)",
  "Iowa": "Iowa Hawkeyes (University of Iowa)",
  "University of Iowa": "Iowa Hawkeyes (University of Iowa)",
  "Iowa State": "Iowa State Cyclones (Iowa State University)",
  "Iowa State University": "Iowa State Cyclones (Iowa State University)",
  "James Madison": "James Madison Dukes (James Madison University)",
  "James Madison University": "James Madison Dukes (James Madison University)",
  "Kansas": "Kansas Jayhawks (University of Kansas)",
  "University of Kansas": "Kansas Jayhawks (University of Kansas)",
  "Kansas State": "Kansas State Wildcats (Kansas State University)",
  "Kansas State University": "Kansas State Wildcats (Kansas State University)",
  "Kent State": "Kent State Golden Flashes (Kent State University)",
  "Kent State University": "Kent State Golden Flashes (Kent State University)",
  "Kentucky": "Kentucky Wildcats (University of Kentucky)",
  "University of Kentucky": "Kentucky Wildcats (University of Kentucky)",
  "Liberty": "Liberty Flames (Liberty University)",
  "Liberty University": "Liberty Flames (Liberty University)",
  "Louisiana": "Louisiana Ragin' Cajuns (University of Louisiana at Lafayette)",
  "University of Louisiana at Lafayette": "Louisiana Ragin' Cajuns (University of Louisiana at Lafayette)",
  "Louisiana-Monroe": "Louisiana-Monroe Warhawks (University of Louisiana at Monroe)",
  "University of Louisiana at Monroe": "Louisiana-Monroe Warhawks (University of Louisiana at Monroe)",
  "ULM": "Louisiana-Monroe Warhawks (University of Louisiana at Monroe)",
  "Louisville": "Louisville Cardinals (University of Louisville)",
  "University of Louisville": "Louisville Cardinals (University of Louisville)",
  "LSU": "LSU Tigers (Louisiana State University)",
  "Louisiana State University": "LSU Tigers (Louisiana State University)",
  "Marshall": "Marshall Thundering Herd (Marshall University)",
  "Marshall University": "Marshall Thundering Herd (Marshall University)",
  "Maryland": "Maryland Terrapins (University of Maryland, College Park)",
  "University of Maryland, College Park": "Maryland Terrapins (University of Maryland, College Park)",
  "Massachusetts": "Massachusetts Minutemen (University of Massachusetts Amherst)",
  "University of Massachusetts Amherst": "Massachusetts Minutemen (University of Massachusetts Amherst)",
  "UMass": "Massachusetts Minutemen (University of Massachusetts Amherst)",
  "Memphis": "Memphis Tigers (University of Memphis)",
  "University of Memphis": "Memphis Tigers (University of Memphis)",
  "Miami": "Miami Hurricanes (University of Miami)",
  "University of Miami": "Miami Hurricanes (University of Miami)",
  "Miami (OH)": "Miami RedHawks (Miami University)",
  "Miami University": "Miami RedHawks (Miami University)",
  "Michigan": "Michigan Wolverines (University of Michigan)",
  "University of Michigan": "Michigan Wolverines (University of Michigan)",
  "Michigan State": "Michigan State Spartans (Michigan State University)",
  "Michigan State University": "Michigan State Spartans (Michigan State University)",
  "Middle Tennessee": "Middle Tennessee Blue Raiders (Middle Tennessee State University)",
  "Middle Tennessee State University": "Middle Tennessee Blue Raiders (Middle Tennessee State University)",
  "Minnesota": "Minnesota Golden Gophers (University of Minnesota, Twin Cities)",
  "University of Minnesota, Twin Cities": "Minnesota Golden Gophers (University of Minnesota, Twin Cities)",
  "Missouri": "Missouri Tigers (University of Missouri)",
  "University of Missouri": "Missouri Tigers (University of Missouri)",
  "Navy": "Navy Midshipmen (United States Naval Academy)",
  "United States Naval Academy": "Navy Midshipmen (United States Naval Academy)",
  "NC State": "NC State Wolfpack (North Carolina State University)",
  "North Carolina State": "NC State Wolfpack (North Carolina State University)",
  "North Carolina State University": "NC State Wolfpack (North Carolina State University)",
  "Nebraska": "Nebraska Cornhuskers (University of Nebraska–Lincoln)",
  "University of Nebraska–Lincoln": "Nebraska Cornhuskers (University of Nebraska–Lincoln)",
  "Nevada": "Nevada Wolf Pack (University of Nevada, Reno)",
  "University of Nevada, Reno": "Nevada Wolf Pack (University of Nevada, Reno)",
  "New Mexico": "New Mexico Lobos (University of New Mexico)",
  "University of New Mexico": "New Mexico Lobos (University of New Mexico)",
  "New Mexico State": "New Mexico State Aggies (New Mexico State University)",
  "New Mexico State University": "New Mexico State Aggies (New Mexico State University)",
  "North Carolina": "North Carolina Tar Heels (University of North Carolina at Chapel Hill)",
  "University of North Carolina at Chapel Hill": "North Carolina Tar Heels (University of North Carolina at Chapel Hill)",
  "UNC": "North Carolina Tar Heels (University of North Carolina at Chapel Hill)",
  "North Texas": "North Texas Mean Green (University of North Texas)",
  "University of North Texas": "North Texas Mean Green (University of North Texas)",
  "Northern Illinois": "Northern Illinois Huskies (Northern Illinois University)",
  "Northern Illinois University": "Northern Illinois Huskies (Northern Illinois University)",
  "Northwestern": "Northwestern Wildcats (Northwestern University)",
  "Northwestern University": "Northwestern Wildcats (Northwestern University)",
  "Notre Dame": "Notre Dame Fighting Irish (University of Notre Dame)",
  "University of Notre Dame": "Notre Dame Fighting Irish (University of Notre Dame)",
  "Ohio": "Ohio Bobcats (Ohio University)",
  "Ohio University": "Ohio Bobcats (Ohio University)",
  "Ohio State": "Ohio State Buckeyes (The Ohio State University)",
  "The Ohio State University": "Ohio State Buckeyes (The Ohio State University)",
  "Oklahoma": "Oklahoma Sooners (University of Oklahoma)",
  "University of Oklahoma": "Oklahoma Sooners (University of Oklahoma)",
  "Oklahoma State": "Oklahoma State Cowboys (Oklahoma State University)",
  "Oklahoma State University": "Oklahoma State Cowboys (Oklahoma State University)",
  "Old Dominion": "Old Dominion Monarchs (Old Dominion University)",
  "Old Dominion University": "Old Dominion Monarchs (Old Dominion University)",
  "Ole Miss": "Ole Miss Rebels (University of Mississippi)",
  "University of Mississippi": "Ole Miss Rebels (University of Mississippi)",
  "Oregon": "Oregon Ducks (University of Oregon)",
  "University of Oregon": "Oregon Ducks (University of Oregon)",
  "Oregon State": "Oregon State Beavers (Oregon State University)",
  "Oregon State University": "Oregon State Beavers (Oregon State University)",
  "Penn State": "Penn State Nittany Lions (The Pennsylvania State University)",
  "The Pennsylvania State University": "Penn State Nittany Lions (The Pennsylvania State University)",
  "Pittsburgh": "Pittsburgh Panthers (University of Pittsburgh)",
  "University of Pittsburgh": "Pittsburgh Panthers (University of Pittsburgh)",
  "Pitt": "Pittsburgh Panthers (University of Pittsburgh)",
  "Purdue": "Purdue Boilermakers (Purdue University)",
  "Purdue University": "Purdue Boilermakers (Purdue University)",
  "Rice": "Rice Owls (Rice University)",
  "Rice University": "Rice Owls (Rice University)",
  "Rutgers": "Rutgers Scarlet Knights (Rutgers University)",
  "Rutgers University": "Rutgers Scarlet Knights (Rutgers University)",
  "Sam Houston": "Sam Houston Bearkats (Sam Houston State University)",
  "Sam Houston State University": "Sam Houston Bearkats (Sam Houston State University)",
  "San Diego State": "San Diego State Aztecs (San Diego State University)",
  "San Diego State University": "San Diego State Aztecs (San Diego State University)",
  "San Jose State": "San Jose State Spartans (San José State University)",
  "San José State University": "San Jose State Spartans (San José State University)",
  "SMU": "SMU Mustangs (Southern Methodist University)",
  "Southern Methodist University": "SMU Mustangs (Southern Methodist University)",
  "South Alabama": "South Alabama Jaguars (University of South Alabama)",
  "University of South Alabama": "South Alabama Jaguars (University of South Alabama)",
  "South Carolina": "South Carolina Gamecocks (University of South Carolina)",
  "University of South Carolina": "South Carolina Gamecocks (University of South Carolina)",
  "South Florida": "South Florida Bulls (University of South Florida)",
  "University of South Florida": "South Florida Bulls (University of South Florida)",
  "USF": "South Florida Bulls (University of South Florida)",
  "Southern Miss": "Southern Miss Golden Eagles (University of Southern Mississippi)",
  "University of Southern Mississippi": "Southern Miss Golden Eagles (University of Southern Mississippi)",
  "Stanford": "Stanford Cardinal (Stanford University)",
  "Stanford University": "Stanford Cardinal (Stanford University)",
  "Syracuse": "Syracuse Orange (Syracuse University)",
  "Syracuse University": "Syracuse Orange (Syracuse University)",
  "TCU": "TCU Horned Frogs (Texas Christian University)",
  "Texas Christian University": "TCU Horned Frogs (Texas Christian University)",
  "Temple": "Temple Owls (Temple University)",
  "Temple University": "Temple Owls (Temple University)",
  "Tennessee": "Tennessee Volunteers (University of Tennessee, Knoxville)",
  "University of Tennessee, Knoxville": "Tennessee Volunteers (University of Tennessee, Knoxville)",
  "Texas": "Texas Longhorns (The University of Texas at Austin)",
  "The University of Texas at Austin": "Texas Longhorns (The University of Texas at Austin)",
  "University of Texas at Austin": "Texas Longhorns (The University of Texas at Austin)",
  "Texas A&M": "Texas A&M Aggies (Texas A&M University)",
  "Texas A&M University": "Texas A&M Aggies (Texas A&M University)",
  "Texas State": "Texas State Bobcats (Texas State University)",
  "Texas State University": "Texas State Bobcats (Texas State University)",
  "Texas Tech": "Texas Tech Red Raiders (Texas Tech University)",
  "Texas Tech University": "Texas Tech Red Raiders (Texas Tech University)",
  "Toledo": "Toledo Rockets (University of Toledo)",
  "University of Toledo": "Toledo Rockets (University of Toledo)",
  "Troy": "Troy Trojans (Troy University)",
  "Troy University": "Troy Trojans (Troy University)",
  "Tulane": "Tulane Green Wave (Tulane University)",
  "Tulane University": "Tulane Green Wave (Tulane University)",
  "Tulsa": "Tulsa Golden Hurricane (University of Tulsa)",
  "University of Tulsa": "Tulsa Golden Hurricane (University of Tulsa)",
  "UAB": "UAB Blazers (University of Alabama at Birmingham)",
  "University of Alabama at Birmingham": "UAB Blazers (University of Alabama at Birmingham)",
  "UCF": "UCF Knights (University of Central Florida)",
  "University of Central Florida": "UCF Knights (University of Central Florida)",
  "UCLA": "UCLA Bruins (University of California, Los Angeles)",
  "University of California, Los Angeles": "UCLA Bruins (University of California, Los Angeles)",
  "UNLV": "UNLV Rebels (University of Nevada, Las Vegas)",
  "University of Nevada, Las Vegas": "UNLV Rebels (University of Nevada, Las Vegas)",
  "USC": "USC Trojans (University of Southern California)",
  "University of Southern California": "USC Trojans (University of Southern California)",
  "UTSA": "UTSA Roadrunners (University of Texas at San Antonio)",
  "University of Texas at San Antonio": "UTSA Roadrunners (University of Texas at San Antonio)",
  "Utah": "Utah Utes (University of Utah)",
  "University of Utah": "Utah Utes (University of Utah)",
  "Utah State": "Utah State Aggies (Utah State University)",
  "Utah State University": "Utah State Aggies (Utah State University)",
  "Vanderbilt": "Vanderbilt Commodores (Vanderbilt University)",
  "Vanderbilt University": "Vanderbilt Commodores (Vanderbilt University)",
  "Virginia": "Virginia Cavaliers (University of Virginia)",
  "University of Virginia": "Virginia Cavaliers (University of Virginia)",
  "Virginia Tech": "Virginia Tech Hokies (Virginia Polytechnic Institute and State University)",
  "Virginia Polytechnic Institute and State University": "Virginia Tech Hokies (Virginia Polytechnic Institute and State University)",
  "Wake Forest": "Wake Forest Demon Deacons (Wake Forest University)",
  "Wake Forest University": "Wake Forest Demon Deacons (Wake Forest University)",
  "Washington": "Washington Huskies (University of Washington)",
  "University of Washington": "Washington Huskies (University of Washington)",
  "Washington State": "Washington State Cougars (Washington State University)",
  "Washington State University": "Washington State Cougars (Washington State University)",
  "West Virginia": "West Virginia Mountaineers (West Virginia University)",
  "West Virginia University": "West Virginia Mountaineers (West Virginia University)",
  "Western Kentucky": "Western Kentucky Hilltoppers (Western Kentucky University)",
  "Western Kentucky University": "Western Kentucky Hilltoppers (Western Kentucky University)",
  "Western Michigan": "Western Michigan Broncos (Western Michigan University)",
  "Western Michigan University": "Western Michigan Broncos (Western Michigan University)",
  "Wisconsin": "Wisconsin Badgers (University of Wisconsin–Madison)",
  "University of Wisconsin–Madison": "Wisconsin Badgers (University of Wisconsin–Madison)",
  "Wyoming": "Wyoming Cowboys (University of Wyoming)",
  "University of Wyoming": "Wyoming Cowboys (University of Wyoming)",
  
  // FCS Schools
  "Abilene Christian": "Abilene Christian Wildcats (Abilene Christian University)",
  "Abilene Christian University": "Abilene Christian Wildcats (Abilene Christian University)",
  "Alabama A&M": "Alabama A&M Bulldogs (Alabama A&M University)",
  "Alabama A&M University": "Alabama A&M Bulldogs (Alabama A&M University)",
  "Alabama State": "Alabama State Hornets (Alabama State University)",
  "Alabama State University": "Alabama State Hornets (Alabama State University)",
  "Albany": "Albany Great Danes (University at Albany, SUNY)",
  "University at Albany, SUNY": "Albany Great Danes (University at Albany, SUNY)",
  "Alcorn State": "Alcorn State Braves (Alcorn State University)",
  "Alcorn State University": "Alcorn State Braves (Alcorn State University)",
  "Austin Peay": "Austin Peay Governors (Austin Peay State University)",
  "Austin Peay State University": "Austin Peay Governors (Austin Peay State University)",
  "Bethune-Cookman": "Bethune-Cookman Wildcats (Bethune-Cookman University)",
  "Bethune-Cookman University": "Bethune-Cookman Wildcats (Bethune-Cookman University)",
  "Brown": "Brown Bears (Brown University)",
  "Brown University": "Brown Bears (Brown University)",
  "Bryant": "Bryant Bulldogs (Bryant University)",
  "Bryant University": "Bryant Bulldogs (Bryant University)",
  "Bucknell": "Bucknell Bison (Bucknell University)",
  "Bucknell University": "Bucknell Bison (Bucknell University)",
  "Butler": "Butler Bulldogs (Butler University)",
  "Butler University": "Butler Bulldogs (Butler University)",
  "Cal Poly": "Cal Poly Mustangs (California Polytechnic State University)",
  "California Polytechnic State University": "Cal Poly Mustangs (California Polytechnic State University)",
  "Campbell": "Campbell Fighting Camels (Campbell University)",
  "Campbell University": "Campbell Fighting Camels (Campbell University)",
  "Central Arkansas": "Central Arkansas Bears (University of Central Arkansas)",
  "University of Central Arkansas": "Central Arkansas Bears (University of Central Arkansas)",
  "Central Connecticut": "Central Connecticut Blue Devils (Central Connecticut State University)",
  "Central Connecticut State University": "Central Connecticut Blue Devils (Central Connecticut State University)",
  "Charleston Southern": "Charleston Southern Buccaneers (Charleston Southern University)",
  "Charleston Southern University": "Charleston Southern Buccaneers (Charleston Southern University)",
  "Chattanooga": "Chattanooga Mocs (University of Tennessee at Chattanooga)",
  "University of Tennessee at Chattanooga": "Chattanooga Mocs (University of Tennessee at Chattanooga)",
  "Colgate": "Colgate Raiders (Colgate University)",
  "Colgate University": "Colgate Raiders (Colgate University)",
  "Columbia": "Columbia Lions (Columbia University)",
  "Columbia University": "Columbia Lions (Columbia University)",
  "Cornell": "Cornell Big Red (Cornell University)",
  "Cornell University": "Cornell Big Red (Cornell University)",
  "Dartmouth": "Dartmouth Big Green (Dartmouth College)",
  "Dartmouth College": "Dartmouth Big Green (Dartmouth College)",
  "Davidson": "Davidson Wildcats (Davidson College)",
  "Davidson College": "Davidson Wildcats (Davidson College)",
  "Dayton": "Dayton Flyers (University of Dayton)",
  "University of Dayton": "Dayton Flyers (University of Dayton)",
  "Delaware": "Delaware Fightin' Blue Hens (University of Delaware)",
  "University of Delaware": "Delaware Fightin' Blue Hens (University of Delaware)",
  "Delaware State": "Delaware State Hornets (Delaware State University)",
  "Delaware State University": "Delaware State Hornets (Delaware State University)",
  "Drake": "Drake Bulldogs (Drake University)",
  "Drake University": "Drake Bulldogs (Drake University)",
  "Duquesne": "Duquesne Dukes (Duquesne University)",
  "Duquesne University": "Duquesne Dukes (Duquesne University)",
  "East Tennessee State": "East Tennessee State Buccaneers (East Tennessee State University)",
  "East Tennessee State University": "East Tennessee State Buccaneers (East Tennessee State University)",
  "Eastern Illinois": "Eastern Illinois Panthers (Eastern Illinois University)",
  "Eastern Illinois University": "Eastern Illinois Panthers (Eastern Illinois University)",
  "Eastern Kentucky": "Eastern Kentucky Colonels (Eastern Kentucky University)",
  "Eastern Kentucky University": "Eastern Kentucky Colonels (Eastern Kentucky University)",
  "Eastern Washington": "Eastern Washington Eagles (Eastern Washington University)",
  "Eastern Washington University": "Eastern Washington Eagles (Eastern Washington University)",
  "Elon": "Elon Phoenix (Elon University)",
  "Elon University": "Elon Phoenix (Elon University)",
  "Florida A&M": "Florida A&M Rattlers (Florida A&M University)",
  "Florida A&M University": "Florida A&M Rattlers (Florida A&M University)",
  "Fordham": "Fordham Rams (Fordham University)",
  "Fordham University": "Fordham Rams (Fordham University)",
  "Furman": "Furman Paladins (Furman University)",
  "Furman University": "Furman Paladins (Furman University)",
  "Gardner-Webb": "Gardner-Webb Runnin' Bulldogs (Gardner-Webb University)",
  "Gardner-Webb University": "Gardner-Webb Runnin' Bulldogs (Gardner-Webb University)",
  "Georgetown": "Georgetown Hoyas (Georgetown University)",
  "Georgetown University": "Georgetown Hoyas (Georgetown University)",
  "Grambling State": "Grambling State Tigers (Grambling State University)",
  "Grambling State University": "Grambling State Tigers (Grambling State University)",
  "Hampton": "Hampton Pirates (Hampton University)",
  "Hampton University": "Hampton Pirates (Hampton University)",
  "Harvard": "Harvard Crimson (Harvard University)",
  "Harvard University": "Harvard Crimson (Harvard University)",
  "Holy Cross": "Holy Cross Crusaders (College of the Holy Cross)",
  "College of the Holy Cross": "Holy Cross Crusaders (College of the Holy Cross)",
  "Houston Christian": "Houston Christian Huskies (Houston Christian University)",
  "Houston Christian University": "Houston Christian Huskies (Houston Christian University)",
  "Howard": "Howard Bison (Howard University)",
  "Howard University": "Howard Bison (Howard University)",
  "Idaho": "Idaho Vandals (University of Idaho)",
  "University of Idaho": "Idaho Vandals (University of Idaho)",
  "Idaho State": "Idaho State Bengals (Idaho State University)",
  "Idaho State University": "Idaho State Bengals (Idaho State University)",
  "Illinois State": "Illinois State Redbirds (Illinois State University)",
  "Illinois State University": "Illinois State Redbirds (Illinois State University)",
  "Incarnate Word": "Incarnate Word Cardinals (University of the Incarnate Word)",
  "University of the Incarnate Word": "Incarnate Word Cardinals (University of the Incarnate Word)",
  "Indiana State": "Indiana State Sycamores (Indiana State University)",
  "Indiana State University": "Indiana State Sycamores (Indiana State University)",
  "Jackson State": "Jackson State Tigers (Jackson State University)",
  "Jackson State University": "Jackson State Tigers (Jackson State University)",
  "Jacksonville State": "Jacksonville State Gamecocks (Jacksonville State University)",
  "Jacksonville State University": "Jacksonville State Gamecocks (Jacksonville State University)",
  "Lafayette": "Lafayette Leopards (Lafayette College)",
  "Lafayette College": "Lafayette Leopards (Lafayette College)",
  "Lamar": "Lamar Cardinals (Lamar University)",
  "Lamar University": "Lamar Cardinals (Lamar University)",
  "Lehigh": "Lehigh Mountain Hawks (Lehigh University)",
  "Lehigh University": "Lehigh Mountain Hawks (Lehigh University)",
  "Lindenwood": "Lindenwood Lions (Lindenwood University)",
  "Lindenwood University": "Lindenwood Lions (Lindenwood University)",
  "LIU": "LIU Sharks (Long Island University)",
  "Long Island University": "LIU Sharks (Long Island University)",
  "Maine": "Maine Black Bears (University of Maine)",
  "University of Maine": "Maine Black Bears (University of Maine)",
  "Marist": "Marist Red Foxes (Marist College)",
  "Marist College": "Marist Red Foxes (Marist College)",
  "McNeese": "McNeese Cowboys (McNeese State University)",
  "McNeese State University": "McNeese Cowboys (McNeese State University)",
  "Mercer": "Mercer Bears (Mercer University)",
  "Mercer University": "Mercer Bears (Mercer University)",
  "Merrimack": "Merrimack Warriors (Merrimack College)",
  "Merrimack College": "Merrimack Warriors (Merrimack College)",
  "Mississippi Valley State": "Mississippi Valley State Delta Devils (Mississippi Valley State University)",
  "Mississippi Valley State University": "Mississippi Valley State Delta Devils (Mississippi Valley State University)",
  "Missouri State": "Missouri State Bears (Missouri State University)",
  "Missouri State University": "Missouri State Bears (Missouri State University)",
  "Monmouth": "Monmouth Hawks (Monmouth University)",
  "Monmouth University": "Monmouth Hawks (Monmouth University)",
  "Montana": "Montana Grizzlies (University of Montana)",
  "University of Montana": "Montana Grizzlies (University of Montana)",
  "Montana State": "Montana State Bobcats (Montana State University)",
  "Montana State University": "Montana State Bobcats (Montana State University)",
  "Morehead State": "Morehead State Eagles (Morehead State University)",
  "Morehead State University": "Morehead State Eagles (Morehead State University)",
  "Morgan State": "Morgan State Bears (Morgan State University)",
  "Morgan State University": "Morgan State Bears (Morgan State University)",
  "Murray State": "Murray State Racers (Murray State University)",
  "Murray State University": "Murray State Racers (Murray State University)",
  "New Hampshire": "New Hampshire Wildcats (University of New Hampshire)",
  "University of New Hampshire": "New Hampshire Wildcats (University of New Hampshire)",
  "New Haven": "New Haven Chargers (University of New Haven)",
  "University of New Haven": "New Haven Chargers (University of New Haven)",
  "Norfolk State": "Norfolk State Spartans (Norfolk State University)",
  "Norfolk State University": "Norfolk State Spartans (Norfolk State University)",
  "North Alabama": "North Alabama Lions (University of North Alabama)",
  "University of North Alabama": "North Alabama Lions (University of North Alabama)",
  "North Carolina A&T": "North Carolina A&T Aggies (North Carolina A&T State University)",
  "North Carolina A&T State University": "North Carolina A&T Aggies (North Carolina A&T State University)",
  "North Carolina Central": "North Carolina Central Eagles (North Carolina Central University)",
  "North Carolina Central University": "North Carolina Central Eagles (North Carolina Central University)",
  "North Dakota": "North Dakota Fighting Hawks (University of North Dakota)",
  "University of North Dakota": "North Dakota Fighting Hawks (University of North Dakota)",
  "North Dakota State": "North Dakota State Bison (North Dakota State University)",
  "North Dakota State University": "North Dakota State Bison (North Dakota State University)",
  "Northern Arizona": "Northern Arizona Lumberjacks (Northern Arizona University)",
  "Northern Arizona University": "Northern Arizona Lumberjacks (Northern Arizona University)",
  "Northern Colorado": "Northern Colorado Bears (University of Northern Colorado)",
  "University of Northern Colorado": "Northern Colorado Bears (University of Northern Colorado)",
  "Northern Iowa": "Northern Iowa Panthers (University of Northern Iowa)",
  "University of Northern Iowa": "Northern Iowa Panthers (University of Northern Iowa)",
  "Northwestern State": "Northwestern State Demons (Northwestern State University)",
  "Northwestern State University": "Northwestern State Demons (Northwestern State University)",
  "Penn": "Penn Quakers (University of Pennsylvania)",
  "University of Pennsylvania": "Penn Quakers (University of Pennsylvania)",
  "Portland State": "Portland State Vikings (Portland State University)",
  "Portland State University": "Portland State Vikings (Portland State University)",
  "Prairie View A&M": "Prairie View A&M Panthers (Prairie View A&M University)",
  "Prairie View A&M University": "Prairie View A&M Panthers (Prairie View A&M University)",
  "Presbyterian": "Presbyterian Blue Hose (Presbyterian College)",
  "Presbyterian College": "Presbyterian Blue Hose (Presbyterian College)",
  "Princeton": "Princeton Tigers (Princeton University)",
  "Princeton University": "Princeton Tigers (Princeton University)",
  "Rhode Island": "Rhode Island Rams (University of Rhode Island)",
  "University of Rhode Island": "Rhode Island Rams (University of Rhode Island)",
  "Richmond": "Richmond Spiders (University of Richmond)",
  "University of Richmond": "Richmond Spiders (University of Richmond)",
  "Robert Morris": "Robert Morris Colonials (Robert Morris University)",
  "Robert Morris University": "Robert Morris Colonials (Robert Morris University)",
  "Sacred Heart": "Sacred Heart Pioneers (Sacred Heart University)",
  "Sacred Heart University": "Sacred Heart Pioneers (Sacred Heart University)",
  "Saint Francis": "Saint Francis Red Flash (Saint Francis University, PA)",
  "Saint Francis University, PA": "Saint Francis Red Flash (Saint Francis University, PA)",
  "Saint Thomas": "Saint Thomas Tommies (University of St. Thomas, MN)",
  "University of St. Thomas, MN": "Saint Thomas Tommies (University of St. Thomas, MN)",
  "Samford": "Samford Bulldogs (Samford University)",
  "Samford University": "Samford Bulldogs (Samford University)",
  "San Diego": "San Diego Toreros (University of San Diego)",
  "University of San Diego": "San Diego Toreros (University of San Diego)",
  "Southeast Missouri State": "Southeast Missouri State Redhawks (Southeast Missouri State University)",
  "Southeast Missouri State University": "Southeast Missouri State Redhawks (Southeast Missouri State University)",
  "Southeastern Louisiana": "Southeastern Louisiana Lions (Southeastern Louisiana University)",
  "Southeastern Louisiana University": "Southeastern Louisiana Lions (Southeastern Louisiana University)",
  "South Carolina State": "South Carolina State Bulldogs (South Carolina State University)",
  "South Carolina State University": "South Carolina State Bulldogs (South Carolina State University)",
  "South Dakota": "South Dakota Coyotes (University of South Dakota)",
  "University of South Dakota": "South Dakota Coyotes (University of South Dakota)",
  "South Dakota State": "South Dakota State Jackrabbits (South Dakota State University)",
  "South Dakota State University": "South Dakota State Jackrabbits (South Dakota State University)",
  "Southern": "Southern Jaguars (Southern University)",
  "Southern University": "Southern Jaguars (Southern University)",
  "Southern Illinois": "Southern Illinois Salukis (Southern Illinois University)",
  "Southern Illinois University": "Southern Illinois Salukis (Southern Illinois University)",
  "Southern Utah": "Southern Utah Thunderbirds (Southern Utah University)",
  "Southern Utah University": "Southern Utah Thunderbirds (Southern Utah University)",
  "Stephen F. Austin": "Stephen F. Austin Lumberjacks (Stephen F. Austin State University)",
  "Stephen F. Austin State University": "Stephen F. Austin Lumberjacks (Stephen F. Austin State University)",
  "Stetson": "Stetson Hatters (Stetson University)",
  "Stetson University": "Stetson Hatters (Stetson University)",
  "Stonehill": "Stonehill Skyhawks (Stonehill College)",
  "Stonehill College": "Stonehill Skyhawks (Stonehill College)",
  "Stony Brook": "Stony Brook Seawolves (Stony Brook University)",
  "Stony Brook University": "Stony Brook Seawolves (Stony Brook University)",
  "Tarleton State": "Tarleton State Texans (Tarleton State University)",
  "Tarleton State University": "Tarleton State Texans (Tarleton State University)",
  "Tennessee State": "Tennessee State Tigers (Tennessee State University)",
  "Tennessee State University": "Tennessee State Tigers (Tennessee State University)",
  "Tennessee Tech": "Tennessee Tech Golden Eagles (Tennessee Technological University)",
  "Tennessee Technological University": "Tennessee Tech Golden Eagles (Tennessee Technological University)",
  "Texas Southern": "Texas Southern Tigers (Texas Southern University)",
  "Texas Southern University": "Texas Southern Tigers (Texas Southern University)",
  "The Citadel": "The Citadel Bulldogs (The Citadel, The Military College of South Carolina)",
  "The Citadel, The Military College of South Carolina": "The Citadel Bulldogs (The Citadel, The Military College of South Carolina)",
  "Towson": "Towson Tigers (Towson University)",
  "Towson University": "Towson Tigers (Towson University)",
  "UC Davis": "UC Davis Aggies (University of California, Davis)",
  "University of California, Davis": "UC Davis Aggies (University of California, Davis)",
  "UTRGV": "UTRGV Vaqueros (University of Texas Rio Grande Valley)",
  "University of Texas Rio Grande Valley": "UTRGV Vaqueros (University of Texas Rio Grande Valley)",
  "UT Martin": "UT Martin Skyhawks (University of Tennessee at Martin)",
  "University of Tennessee at Martin": "UT Martin Skyhawks (University of Tennessee at Martin)",
  "Utah Tech": "Utah Tech Trailblazers (Utah Tech University)",
  "Utah Tech University": "Utah Tech Trailblazers (Utah Tech University)",
  "Valparaiso": "Valparaiso Beacons (Valparaiso University)",
  "Valparaiso University": "Valparaiso Beacons (Valparaiso University)",
  "Villanova": "Villanova Wildcats (Villanova University)",
  "Villanova University": "Villanova Wildcats (Villanova University)",
  "Virginia Military Institute": "Virginia Military Institute Keydets (Virginia Military Institute)",
  "Wagner": "Wagner Seahawks (Wagner College)",
  "Wagner College": "Wagner Seahawks (Wagner College)",
  "Weber State": "Weber State Wildcats (Weber State University)",
  "Weber State University": "Weber State Wildcats (Weber State University)",
  "West Georgia": "West Georgia Wolves (University of West Georgia)",
  "University of West Georgia": "West Georgia Wolves (University of West Georgia)",
  "Western Carolina": "Western Carolina Catamounts (Western Carolina University)",
  "Western Carolina University": "Western Carolina Catamounts (Western Carolina University)",
  "Western Illinois": "Western Illinois Leathernecks (Western Illinois University)",
  "Western Illinois University": "Western Illinois Leathernecks (Western Illinois University)",
  "William & Mary": "William & Mary Tribe (College of William & Mary)",
  "College of William & Mary": "William & Mary Tribe (College of William & Mary)",
  "Wofford": "Wofford Terriers (Wofford College)",
  "Wofford College": "Wofford Terriers (Wofford College)",
  "Yale": "Yale Bulldogs (Yale University)",
  "Yale University": "Yale Bulldogs (Yale University)",
  "Youngstown State": "Youngstown State Penguins (Youngstown State University)",
  "Youngstown State University": "Youngstown State Penguins (Youngstown State University)",
};

export default function AdminUpdateSchools() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [user, setUser] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    if (user?.role !== 'admin') {
      alert('Admin access required');
      return;
    }

    if (!confirm('This will update all school names. Continue?')) {
      return;
    }

    setUpdating(true);
    setResult(null);

    try {
      const allSchools = await School.list();
      
      const report = {
        updated: [],
        skipped: [],
        errors: []
      };

      for (const school of allSchools) {
        try {
          const newName = SCHOOL_MAPPINGS[school.name];
          
          if (newName && newName !== school.name) {
            await School.update(school.id, { name: newName });
            report.updated.push({ from: school.name, to: newName });
          } else {
            report.skipped.push(school.name);
          }
        } catch (error) {
          report.errors.push({ school: school.name, error: error.message });
        }
      }

      setResult(report);

    } catch (error) {
      console.error('Update failed:', error);
      alert('Update failed: ' + error.message);
    }

    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Alert className="max-w-md">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            Admin access required to update schools.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Update School Names</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-600">
              This will update all school names to the format: <strong>Team Name (School Name)</strong>
            </p>
            
            <div className="flex gap-4">
              <Button 
                onClick={handleUpdate}
                disabled={updating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {updating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    Update All Schools
                  </>
                )}
              </Button>
            </div>

            {result && (
              <div className="space-y-4 mt-6">
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Successfully updated {result.updated.length} schools!</strong>
                    <br />
                    Skipped: {result.skipped.length} | Errors: {result.errors.length}
                  </AlertDescription>
                </Alert>

                {result.updated.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Updated Schools:</h3>
                    <div className="max-h-64 overflow-y-auto bg-slate-50 rounded p-3 space-y-1 text-sm">
                      {result.updated.map((item, idx) => (
                        <div key={idx}>
                          <span className="text-slate-500">{item.from}</span>
                          {' → '}
                          <span className="text-green-600 font-medium">{item.to}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.errors.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-red-600 mb-2">Errors:</h3>
                    <div className="max-h-32 overflow-y-auto bg-red-50 rounded p-3 space-y-1 text-sm">
                      {result.errors.map((item, idx) => (
                        <div key={idx} className="text-red-700">
                          {item.school}: {item.error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
