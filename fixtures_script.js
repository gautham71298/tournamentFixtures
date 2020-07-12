/**
 * Developed by gautham71298 on April-2020.
 */
"use strict";

let nextTeamName = () => {

  $("#formField").empty();
  $("#matchSchedule").empty();
  $("#totalNoOfMatch").empty();
  $("#tournamentHeader").empty();
  $("#tournamentBracket").empty();
  $("#formField").hide();
  $("#matchSchedule").hide();
  $("#totalNoOfMatch").hide();
  $("#tournamentHeader").hide();
  $("#tournamentBracket").hide();

  let noOfTeamsValue = document.getElementById("noOfTeams").value;
  if (!noOfTeamsValue) {
    alert("Please enter team(N) count.")
  } else if (noOfTeamsValue <= 64 && noOfTeamsValue >= 2) {
    for (let index = 1; index <= noOfTeamsValue; index++) {
      $(".teamSizeInputContainer").hide();
      $(".submitContainer").hide();
      $("#formField").append(`
        <div class="col-sm-6">
          <div class="inputBox teamNameInputField">
            <input type="text" id="textName${index}" class="input" placeholder="Enter the name of Team${index}"
            onfocus="this.placeholder = ''" onblur="this.placeholder = 'Enter the name of Team ${index}'">
            <label class="label-helper" for="input">Team ${index} :</label>
          </div>
        </div>
      `);
    }
    // Team flag upload field.
    // <div class="col-md-4">
    //   <input type="file" class="uploadImgField" id="teamFlag${index}" onchange="uploadImg(event)" name="teamFlag${index}">
    // </div>
    $("#formField").show();
    $("#totalNoOfMatch").append(`
      <h3>Total no. of Matches : <span>${noOfTeamsValue - 1}</span></h3>
  `);
    for (let index = 1; index < noOfTeamsValue; index++) {
      $("#matchSchedule").append(`
      <div class="matchDateTime">
        <div class="center">
          <label class="namesLabelField">Game ${index} : </label>
        </div>
        <div class="">
          <input type="date" class="matchInputField" id="matchDate${index}" name="matchDate" placeholder="Day/Month/Year">
          <input type="text" class="matchTimeInputField" id="matchTime${index}" name="matchTime" placeholder="Time of the Match">
          <input type="text" class="matchVenueInputField" id="matchVenue${index}" name="matchVenue" placeholder="Venue">
        </div>
      </div>
    `);
    }
    $("#matchSchedule").show();
    $("#generateBtn").show();
    $("#saveBtn").show();
    $("#totalNoOfMatch").show();
    $("#tournamentHeader").show();
    $("#tournamentBracket").show();
  } else {
    alert(`Sorry, ${noOfTeamsValue} is not available. Team size should be 2 to 32`)
  }
}

// Upload Image fn() to save in Local storage.
// function uploadImage(event) {
//   var reader = new FileReader();
//   var name = event.target.files[0].name;
//   reader.addEventListener("load", function () {
//     if (this.result && localStorage) {
//       window.localStorage.setItem(name, this.result);
//     } else {
//       alert();
//     }
//   });
//   reader.readAsDataURL(event.target.files[0]);
// }

// // Displaying the uploaded image.
// let noOfTeamsValue = document.getElementById("noOfTeams").value;
// let uploadImg = function (event) {
//   for (let value = 1; value <= noOfTeamsValue; value++) {
//     var image = document.getElementById(`imgOutput${value}`);
//     image.src = URL.createObjectURL(event.target.files[0]);
//   };
// }

// The main function for creating the tournament bracket.

let generate = () => {
  // $("#teamNameAndMatchdate").hide();
  // $(".BackToTeamSize").show();

  let noOfTeamsValue = document.getElementById("noOfTeams").value;

  // Getting team names data.
  let names = [];
  for (let value = 1; value <= noOfTeamsValue; value++) {
    let nameOfPlayer = document.getElementById(`textName${value}`).value;
    names.push(nameOfPlayer);
  }

  // Getting match date for each match.
  let matchSchedule = [];
  for (let value = 1; value < noOfTeamsValue; value++) {
    let matchDate = document.getElementById(`matchDate${value}`).value;
    let matchTime = document.getElementById(`matchTime${value}`).value;
    let capitalMatchTime = matchTime.toUpperCase();
    matchSchedule.push(matchDate + ` | ` + capitalMatchTime);
  }

  // Getting match venue for each match
  let matchVenueArr = [];
  for (let value = 1; value < noOfTeamsValue; value++) {
    let matchVenue = document.getElementById(`matchVenue${value}`).value;
    let capitalMatchVenue = matchVenue.toUpperCase();
    matchVenueArr.push(capitalMatchVenue);
  }

  let flags = [["img/champion-cup.png"]];
  for (let value = 1; value <= noOfTeamsValue; value++) {
    let teamFlag = document.getElementById(`teamFlag${value}`);
    flags.push(teamFlag);
  }

  let roundsDummy = {
    player1: { name: 'Winner', ID: -3, },
    player2: { name: 'Winner', ID: -3, }
  };

  let roundsFinalDummy = {
    player1: {
      name: 'Champion',
      winner: true,
      ID: -1,
      flag: flags[0],
      matchDate: matchSchedule[matchSchedule.length - 1],
      matchVenue: matchVenueArr[matchVenueArr.length - 1]
    }
  };

  let round1ByePlr2 = {
    player2: { name: 'BYE ', ID: -2 }
  }

  let player1Vs = {
    player1: { name: 'Winner', ID: -3 }
  };

  let player2Vs = {
    player2: { name: 'Winner', ID: -3 }
  };

  // Round titles for all the team sizes.
  let roundsTitles = [
    ['TEAMS', 'FINAL-GAME'],
    ['TEAMS', 'SEMI-FINAL', 'FINAL-GAME'],
    ['TEAMS', 'ROUND-1', 'SEMI-FINAL', 'FINAL-GAME'],
    ['TEAMS', 'ROUND-1', 'QUATER-FINAL', 'SEMI-FINAL', 'FINAL-GAME'],
    ['TEAMS', 'ROUND-1', 'ROUND-2', 'QUATER-FINAL', 'SEMI-FINAL', 'FINAL-GAME',],
    ['TEAMS', 'ROUND-1', 'ROUND-2', 'ROUND-3', 'QUATER-FINAL', 'SEMI-FINAL', 'FINAL-GAME',]
  ]

  // Getting the appropiate titles for bracket.
  function titlesfn(teamValue) {
    if (teamValue == 2)
      return roundsTitles[0];
    else if (teamValue <= 4)
      return roundsTitles[1];
    else if (teamValue <= 8)
      return roundsTitles[2];
    else if (teamValue <= 16)
      return roundsTitles[3];
    else if (teamValue <= 32)
      return roundsTitles[4];
    else if (teamValue <= 64)
      return roundsTitles[5];
  }

  // To invicible the bye's border.
  let styleBorder = (lineNumber1, lineNumber2) => {
    document.getElementById(lineNumber1).style.border = '1px solid white ';
    document.getElementById(lineNumber2).style.border = '1px solid white ';
  }

  // This fn is to add the matchdate from date[] to the player data.
  function cloneRoundsDummyfn(indexYValue, indexEndValue) {
    let cloneroundsDummy = [];
    for (let indexX = 0, indexY = indexYValue; indexX < indexEndValue; indexX++, indexY++) {
      cloneroundsDummy.push(JSON.parse(JSON.stringify(roundsDummy)));
      cloneroundsDummy[indexX].player1.matchDate = matchSchedule[indexY];
      cloneroundsDummy[indexX].player1.matchVenue = matchVenueArr[indexY];
      cloneroundsDummy[indexX].player2.matchDate = matchSchedule[++indexY];
      cloneroundsDummy[indexX].player2.matchVenue = matchVenueArr[indexY];
    } return cloneroundsDummy;
  }

  // Initialising the required round2 variable and adding match date to it.
  let matchDateRound1 = 0
  function round2ClonePlayersInitfn(number) {
    let cloneplayerVs = [[], []];
    for (let index = matchDateRound1, indexY = matchDateRound1 - 1; index < number; index++, indexY++) {
      cloneplayerVs[0].push(JSON.parse(JSON.stringify(player1Vs)));
      cloneplayerVs[0][index].player1.matchDate = matchSchedule[++indexY];
      cloneplayerVs[0][index].player1.matchVenue = matchVenueArr[indexY];
    }
    for (let index = matchDateRound1, indexY = matchDateRound1; index < number; index++, indexY++) {
      cloneplayerVs[1].push(JSON.parse(JSON.stringify(player2Vs)));
      cloneplayerVs[1][index].player2.matchDate = matchSchedule[++indexY];
      cloneplayerVs[1][index].player2.matchVenue = matchVenueArr[indexY];
    }
    matchDateRound1 = matchDateRound1 + number;
    // console.log(matchDateRound1)
    return cloneplayerVs;
  }

  // For the actual work of adding round2 data.
  let matchDateRound1Data = 0;
  function round2ClonePlayersVsfn(clonePlayerVsInit, limit) {
    let clonePlayersVs = [];
    for (let index = matchDateRound1Data; index < limit; index++) {
      clonePlayersVs.push({
        ...clonePlayerVsInit[0][index],
        ...clonePlayerVsInit[1][index]
      });
    }
    // Build in progress -- This line is messing up everything. Not functioning.
    matchDateRound1Data = matchDateRound1Data + limit;
    return clonePlayersVs;
  }

  // Creating players and matching them.
  function playerMatch(namesIndex, playerId, teamNumber) { // 0 1 1
    var round1 = [];
    for (let index = namesIndex; index < teamNumber; index++, namesIndex++, playerId++) {
      round1.push({
        player1: { name: names[namesIndex], ID: playerId },
        player2: { name: names[++namesIndex], ID: ++playerId }
      });
    } return round1;
  }

  // Creating the entire first round.
  function teamBracketRound1(teamNumber) { // 1
    let rounds = [];
    let round1 = playerMatch(0, 1, teamNumber);
    // let round2 = cloneRoundsDummyfn(0, 3);
    rounds.push([...round1]);
    // rounds.push([...round2]);
    // for (let index = 0; index < teamNumber; index++) {
    // }
    // rounds.push(
    //   [roundsFinalDummy],
    //   [roundsFinalDummy],
    // [roundsFinalDummy]
    // );
    return rounds;
  }

  // For the coming rounds to get bracket generated.
  function consecutiveRoundsfn(number) {
    let round = [];
    let clonePlayerVsInit = round2ClonePlayersInitfn(number);
    let round2 = round2ClonePlayersVsfn(clonePlayerVsInit, number);
    round.push([...round2]);
    return round;
  }

  // For generating the bye team for team 3
  function team3Round1Bye(teamNumber) { // 5
    let round1Bye = [];
    round1Bye.push({
      player1: { name: names[teamNumber] + `(Bye)`, ID: 101 },
      ...round1ByePlr2
    });
    return round1Bye;
  }

  // Fn() that only generate round 1 of team size 3.
  function team3Round1(startValue) { // 5
    let round1 = [];
    let round1Bye = team3Round1Bye(startValue);
    round1.push(...round1Bye);
    let number = startValue + 1;
    round1.push(
      {
        player1: { name: names[number], ID: number + 1 },
        player2: { name: names[++number], ID: number + 1 }
      },
    );
    return round1;
  }

  // Fn() that only generate round 2 of team size 3
  function team3Round2(startValue, matchDateValue) { // 5 5
    let round2 = [];
    round2.push(
      {
        player1: { name: names[startValue], ID: startValue + 1 },
        player2: { name: 'Winner', ID: -3, matchDate: matchSchedule[matchDateValue], matchVenue: matchVenueArr[matchDateValue] }
      },
    );
    return round2;
  }

  // Fn() for team size 3.
  function teamValue3(startValue) {
    let round1 = team3Round1(startValue);
    let round2 = team3Round2(startValue, startValue);
    var rounds = [
      [...round1],
      [...round2]
    ]
    return rounds;
  }

  // Fn() that only generates round 1 of team size 5.
  function team5Round1(startValue) {
    let rounds = [];
    let round1UpHalf = team3Round1(startValue);
    let round1LowHalf = [];
    for (let index = startValue; index < startValue + 2; index++) {
      round1LowHalf.push(...team3Round1Bye(index + 3));
    }
    rounds.push(
      ...round1UpHalf, ...round1LowHalf
    ); return rounds;
  }

  // Fn() that only generates round 2 of team size 5.
  function team5Round2(startValue, matchDateValue) {
    let rounds = [];
    let round2UpHalf = team3Round2(startValue, matchDateValue);
    rounds.push(
      ...round2UpHalf, {
      player1: { name: names[startValue + 3], ID: startValue + 4 },
      player2: { name: names[startValue + 4], ID: startValue + 5 }
    }
    );
    return rounds;
  }

  // Fn() for team size 5.
  function teamValue5(startValue) { // 5
    let rounds = [];
    rounds.push([...team5Round1(startValue)], [...team5Round2(startValue, startValue)]);
    return rounds;
  }

  // Checks the team size that user entered.
  function tournamentBracketGenerator(teamSize) {
    // Build in progress -- it is not functioning properly.
    if (true) { // -- All the doubles of 2.
      if (teamSize == 2) {
        let rounds = teamBracketRound1(teamSize / 2);
        rounds.push([roundsFinalDummy]);
        return rounds;
      }
      if (teamSize == 4) {
        let cloneroundsDummy = cloneRoundsDummyfn(0, 1);
        let rounds = teamBracketRound1(teamSize / 2);
        rounds.push([cloneroundsDummy[0]],
          [roundsFinalDummy]
        );
        return rounds;
      }
      if (teamSize == 8) {
        let cloneroundsDummy = cloneRoundsDummyfn(0, 3);
        var rounds = teamBracketRound1(teamSize / 2)
        rounds.push([
          cloneroundsDummy[0],
          cloneroundsDummy[1],
        ],
          [cloneroundsDummy[2]],
          [roundsFinalDummy]
        );
        return rounds;
      }
      if (teamSize == 16) {
        let cloneroundsDummy = cloneRoundsDummyfn(8, 7);
        let clonePlayerVsInit = round2ClonePlayersInitfn((teamSize / 2) / 2);
        var rounds = teamBracketRound1(teamSize / 2);
        var round2 = round2ClonePlayersVsfn(clonePlayerVsInit, (teamSize / 2) / 2);
        rounds.push(
          [...round2],
          [cloneroundsDummy[0], cloneroundsDummy[1]],
          [cloneroundsDummy[2]],
          [roundsFinalDummy]
        );
        return rounds;
      }
      if (teamSize == 32) {
        let cloneroundsDummy = cloneRoundsDummyfn(teamSize / 2, 7);
        let clonePlayerVsInit = round2ClonePlayersInitfn((teamSize / 2) / 2);
        var rounds = teamBracketRound1(teamSize / 2);
        var round2 = round2ClonePlayersVsfn(clonePlayerVsInit, (teamSize / 2) / 2);
        rounds.push([...round2],
          [
            // cloneroundsDummyfn()
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3]
          ],
          [cloneroundsDummy[4], cloneroundsDummy[5]],
          [cloneroundsDummy[6]],
          [roundsFinalDummy]
        );
        return rounds;
      }
      if (teamSize == 64) {
        // var rounds = teamBracketRound1(teamSize / 2);
        // // var consecutiveRounds = [];
        // let number = teamSize / 2;
        // for (let index = 0; index < 5; index++) { // Number 5 indicated the number of rounds to generate.
        //   let consecutiveRounds = consecutiveRoundsfn(number);
        //   console.log(consecutiveRounds[0])
        //   rounds.push([...consecutiveRounds[0]]);
        //   number = number / 2;
        // }
        // rounds.push([roundsFinalDummy]);
        // return rounds;
        let cloneroundsDummy = cloneRoundsDummyfn(teamSize / 2, 15);
        let clonePlayerVsInit = round2ClonePlayersInitfn((teamSize / 2) / 2);
        var rounds = teamBracketRound1(teamSize / 2);
        var round2 = round2ClonePlayersVsfn(clonePlayerVsInit, (teamSize / 2) / 2);
        rounds.push([...round2],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            // cloneroundsDummyfn()
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        );
        return rounds;
      }
    }

    if (teamSize % 2) {
      if (teamSize == 3) {
        let rounds = teamValue3(0);
        rounds.push([roundsFinalDummy]);
        return rounds;
      }
      else if (teamSize == 5) {
        var cloneroundsDummy = JSON.parse(JSON.stringify(roundsDummy));
        cloneroundsDummy.player1.matchDate = matchSchedule[1];
        cloneroundsDummy.player2.matchDate = matchSchedule[2];
        cloneroundsDummy.player1.matchVenue = matchVenueArr[1];
        cloneroundsDummy.player2.matchVenue = matchVenueArr[2];
        let rounds = teamValue5(0);
        rounds.push(
          [cloneroundsDummy],
          [roundsFinalDummy]
        );
        return rounds;
      }
      else if (teamSize == 7) {
        var cloneroundsDummy = JSON.parse(JSON.stringify(roundsDummy));
        var cloneroundsDummy2 = JSON.parse(JSON.stringify(roundsDummy));
        var cloneplayer1Vs = JSON.parse(JSON.stringify(player1Vs));
        cloneroundsDummy.player1.matchDate = matchSchedule[0];
        cloneroundsDummy.player2.matchDate = matchSchedule[1];
        cloneroundsDummy2.player1.matchDate = matchSchedule[3];
        cloneroundsDummy2.player2.matchDate = matchSchedule[4];
        cloneplayer1Vs.player1.matchDate = matchSchedule[2];
        cloneroundsDummy.player1.matchVenue = matchVenueArr[0];
        cloneroundsDummy.player2.matchVenue = matchVenueArr[1];
        cloneroundsDummy2.player1.matchVenue = matchVenueArr[3];
        cloneroundsDummy2.player2.matchVenue = matchVenueArr[4];
        cloneplayer1Vs.player1.matchVenue = matchVenueArr[2];

        var rounds = [
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              player2: { name: names[1], winner: true, ID: 2 },
            },
            {
              player1: { name: names[2], winner: true, ID: 3 },
              player2: { name: names[3], winner: true, ID: 4 }
            },
            {
              player1: { name: names[4], winner: true, ID: 5 },
              player2: { name: names[5], winner: true, ID: 6 }
            },
            {
              player1: { name: names[6] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
          ],
          [
            cloneroundsDummy,
            {
              ...cloneplayer1Vs,
              player2: { name: names[6], winner: true, ID: 7 }
            }
          ],
          [cloneroundsDummy2],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 9) {
        let cloneroundsDummy = cloneRoundsDummyfn(1, 3);

        var cloneplayer1Vs = JSON.parse(JSON.stringify(player1Vs));
        cloneplayer1Vs.player1.matchDate = matchSchedule[0];
        cloneplayer1Vs.player1.matchVenue = matchVenueArr[0];

        var rounds = [
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              player2: { name: names[1], winner: true, ID: 2 },
            },
            {
              player1: { name: names[2] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[3] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[4] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[5] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[6] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[7] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[8] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            }
          ],
          [
            {
              ...cloneplayer1Vs,
              player2: { name: names[2], winner: true, ID: 3 },
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              player2: { name: names[4], winner: true, ID: 5 },
            },
            {
              player1: { name: names[5], winner: true, ID: 6 },
              player2: { name: names[6], winner: true, ID: 7 },
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              player2: { name: names[8], winner: true, ID: 9 },
            }
          ],
          [cloneroundsDummy[0], cloneroundsDummy[1]],
          [cloneroundsDummy[2]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 11) {
        let cloneroundsDummy = cloneRoundsDummyfn(3, 3);

        let cloneplayer2Vs = [];
        for (let index = 0; index < 2; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
        }
        cloneplayer2Vs[0].player2.matchDate = matchSchedule[0];
        cloneplayer2Vs[1].player2.matchDate = matchSchedule[2];

        var cloneplayer1Vs = JSON.parse(JSON.stringify(roundsDummy));
        cloneplayer1Vs.player1.matchDate = matchSchedule[1]

        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              player2: { name: names[4], winner: true, ID: 5 },
            },
            {
              player1: { name: names[5] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[6] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              player2: { name: names[8], winner: true, ID: 9 }
            },
            {
              player1: { name: names[9] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[10] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs,
              player2: { name: names[5], winner: true, ID: 6 },
            },
            {
              player1: { name: names[6], winner: true, ID: 7 },
              ...cloneplayer2Vs[1]
            },
            {
              player1: { name: names[9], winner: true, ID: 10 },
              player2: { name: names[10], winner: true, ID: 11 }
            },
          ],
          [cloneroundsDummy[0], cloneroundsDummy[1]],
          [cloneroundsDummy[2]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 13) {
        let cloneroundsDummy = cloneRoundsDummyfn(5, 3);

        let cloneplayer2Vs = [];
        for (let index = 0; index < 2; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
        }
        cloneplayer2Vs[0].player2.matchDate = matchSchedule[1];
        cloneplayer2Vs[1].player2.matchDate = matchSchedule[3];

        let cloneplayer1Vs = [];
        for (let index = 0; index < 3; index++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
        }
        cloneplayer1Vs[0].player1.matchDate = matchSchedule[0];
        cloneplayer1Vs[1].player1.matchDate = matchSchedule[2];
        cloneplayer1Vs[2].player1.matchDate = matchSchedule[4];

        var rounds = [
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              player2: { name: names[1], winner: true, ID: 2 },
            },
            {
              player1: { name: names[2], winner: true, ID: 3 },
              player2: { name: names[3], winner: true, ID: 4 }
            },
            {
              player1: { name: names[4], winner: true, ID: 5 },
              player2: { name: names[5], winner: true, ID: 6 }
            },
            {
              player1: { name: names[6] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[7] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[8], winner: true, ID: 9 },
              player2: { name: names[9], winner: true, ID: 10 },
            },
            {
              player1: { name: names[10], winner: true, ID: 11 },
              player2: { name: names[11], winner: true, ID: 12 },
            },
            {
              player1: { name: names[12] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            }
          ],
          [
            {
              ...cloneplayer1Vs[0],
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs[1],
              player2: { name: names[6], winner: true, ID: 7 },
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              ...cloneplayer2Vs[1]
            },
            {
              ...cloneplayer1Vs[2],
              player2: { name: names[12], winner: true, ID: 13 },
            }
          ],
          [cloneroundsDummy[0], cloneroundsDummy[1]],
          [cloneroundsDummy[2]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 15) {
        let cloneroundsDummy = cloneRoundsDummyfn(7, 3);

        let cloneplayer1Vs = [];
        for (let index = 0; index < 4; index++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
          cloneplayer1Vs[index].player1.matchDate = matchSchedule[index * 2];
        }

        let cloneplayer2Vs = [];
        for (let index = 0, indexY = 0; index < 3; index++, indexY++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
          cloneplayer2Vs[index].player2.matchDate = matchSchedule[++indexY];
        }

        var rounds = [
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              player2: { name: names[1], winner: true, ID: 2 },
            },
            {
              player1: { name: names[2], winner: true, ID: 3 },
              player2: { name: names[3], winner: true, ID: 4 },
            },
            {
              player1: { name: names[4], winner: true, ID: 5 },
              player2: { name: names[5], winner: true, ID: 6 }
            },
            {
              player1: { name: names[6], winner: true, ID: 7 },
              player2: { name: names[7], winner: true, ID: 8 },
            },
            {
              player1: { name: names[8], winner: true, ID: 9 },
              player2: { name: names[9], winner: true, ID: 10 },
            },
            {
              player1: { name: names[10], winner: true, ID: 11 },
              player2: { name: names[11], winner: true, ID: 12 }
            },
            {
              player1: { name: names[12], winner: true, ID: 13 },
              player2: { name: names[13], winner: true, ID: 14 }
            },
            {
              player1: { name: names[14] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
          ],
          [
            {
              ...cloneplayer1Vs[0],
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs[1],
              ...cloneplayer2Vs[1]
            },
            {
              ...cloneplayer1Vs[2],
              ...cloneplayer2Vs[2]
            },
            {
              ...cloneplayer1Vs[3],
              player2: { name: names[14], winner: true, ID: 15 },
            }
          ],
          [cloneroundsDummy[0], cloneroundsDummy[1]],
          [cloneroundsDummy[2]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 17) {
        let cloneroundsDummy = cloneRoundsDummyfn(1, 7);

        var cloneplayer2Vs = JSON.parse(JSON.stringify(player2Vs));
        cloneplayer2Vs.player2.matchDate = matchSchedule[0];

        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            {
              player1: { name: names[3] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[4] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[5] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[6] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[7] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[8] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[9] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[10] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[11] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[12] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[13] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[14] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[15] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[16] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 0 },
              ...cloneplayer2Vs,
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              player2: { name: names[4], winner: true, ID: 5 },
            },
            {
              player1: { name: names[5], winner: true, ID: 6 },
              player2: { name: names[6], winner: true, ID: 7 },
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              player2: { name: names[8], winner: true, ID: 9 },
            },
            {
              player1: { name: names[9], winner: true, ID: 10 },
              player2: { name: names[10], winner: true, ID: 11 },
            },
            {
              player1: { name: names[11], winner: true, ID: 12 },
              player2: { name: names[12], winner: true, ID: 13 },
            },
            {
              player1: { name: names[13], winner: true, ID: 14 },
              player2: { name: names[14], winner: true, ID: 15 },
            },
            {
              player1: { name: names[15], winner: true, ID: 16 },
              player2: { name: names[16], winner: true, ID: 17 },
            }
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3]
          ],
          [cloneroundsDummy[4], cloneroundsDummy[5]],
          [cloneroundsDummy[6]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 19) {
        let cloneroundsDummy = cloneRoundsDummyfn(3, 7);

        let cloneplayer2Vs = [];
        for (let index = 0; index < 2; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
          cloneplayer2Vs[index].player2.matchDate = matchSchedule[index];
        }

        var cloneplayer1Vs = JSON.parse(JSON.stringify(player1Vs));
        cloneplayer1Vs.player1.matchDate = matchSchedule[2];

        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            {
              player1: { name: names[3] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[4] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[5] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[6], winner: true, ID: 7 },
              player2: { name: names[7], winner: true, ID: 8 },
            },
            {
              player1: { name: names[8] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[9] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[10], winner: true, ID: 11 },
              player2: { name: names[11], winner: true, ID: 12 },
            },
            {
              player1: { name: names[12] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[13] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[14] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[15] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[16] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[17] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[18] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            }
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs[0]
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              player2: { name: names[4], winner: true, ID: 5 },
            },
            {
              player1: { name: names[5], winner: true, ID: 6 },
              ...cloneplayer2Vs[1]
            },
            {
              player1: { name: names[8], winner: true, ID: 9 },
              player2: { name: names[9], winner: true, ID: 10 },
            },
            {
              ...cloneplayer1Vs,
              player2: { name: names[12], winner: true, ID: 13 },
            },
            {
              player1: { name: names[13], winner: true, ID: 14 },
              player2: { name: names[14], winner: true, ID: 15 },
            },
            {
              player1: { name: names[15], winner: true, ID: 16 },
              player2: { name: names[16], winner: true, ID: 17 },
            },
            {
              player1: { name: names[17], winner: true, ID: 18 },
              player2: { name: names[18], winner: true, ID: 19 },
            }
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3]
          ],
          [cloneroundsDummy[4], cloneroundsDummy[5]],
          [cloneroundsDummy[6]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 21) {
        let cloneroundsDummy = cloneRoundsDummyfn(5, 7);

        let cloneplayer2Vs = [];
        for (let index = 0; index < 4; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
          if (index > 0)
            cloneplayer2Vs[index].player2.matchDate = matchSchedule[index + 1];
        }
        cloneplayer2Vs[0].player2.matchDate = matchSchedule[0];

        var cloneplayer1Vs = JSON.parse(JSON.stringify(player1Vs));
        cloneplayer1Vs.player1.matchDate = matchSchedule[1];

        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              player2: { name: names[4], winner: true, ID: 5 },
            },
            {
              player1: { name: names[5] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[6] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              player2: { name: names[8], winner: true, ID: 9 }
            },
            {
              player1: { name: names[9] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[10] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[11] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[12], winner: true, ID: 13 },
              player2: { name: names[13], winner: true, ID: 14 },
            },
            {
              player1: { name: names[14] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[15] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[16] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[17], winner: true, ID: 18 },
              player2: { name: names[18], winner: true, ID: 19 },
            },
            {
              player1: { name: names[19] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[20] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs,
              player2: { name: names[5], winner: true, ID: 6 },
            },
            {
              player1: { name: names[6], winner: true, ID: 7 },
              ...cloneplayer2Vs[1]
            },
            {
              player1: { name: names[9], winner: true, ID: 10 },
              player2: { name: names[10], winner: true, ID: 11 }
            },
            {
              player1: { name: names[11], winner: true, ID: 12 },
              ...cloneplayer2Vs[2]
            },
            {
              player1: { name: names[14], winner: true, ID: 15 },
              player2: { name: names[15], winner: true, ID: 16 },
            },
            {
              player1: { name: names[16], winner: true, ID: 17 },
              ...cloneplayer2Vs[3]
            },
            {
              player1: { name: names[19], winner: true, ID: 20 },
              player2: { name: names[20], winner: true, ID: 21 },
            },
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3]
          ],
          [cloneroundsDummy[4], cloneroundsDummy[5]],
          [cloneroundsDummy[6]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 23) {
        let cloneroundsDummy = cloneRoundsDummyfn(7, 7);

        let cloneplayer2Vs = [];
        for (let index = 0; index < 5; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
          cloneplayer2Vs[index].player2.matchDate = matchSchedule[index];
        }
        cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
        cloneplayer2Vs[5].player2.matchDate = matchSchedule[6];

        let cloneplayer1Vs = JSON.parse(JSON.stringify(player1Vs));
        cloneplayer1Vs.player1.matchDate = matchSchedule[5];

        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            {
              player1: { name: names[3] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[4], winner: true, ID: 5 },
              player2: { name: names[5], winner: true, ID: 6 },
            },
            {
              player1: { name: names[6] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              player2: { name: names[8], winner: true, ID: 9 },
            },
            {
              player1: { name: names[9] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[10], winner: true, ID: 11 },
              player2: { name: names[11], winner: true, ID: 12 },
            },
            {
              player1: { name: names[12] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[13], winner: true, ID: 14 },
              player2: { name: names[14], winner: true, ID: 15 },
            },
            {
              player1: { name: names[15], winner: true, ID: 16 },
              player2: { name: names[16], winner: true, ID: 17 },
            },
            {
              player1: { name: names[17] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[18] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[19], winner: true, ID: 20 },
              player2: { name: names[20], winner: true, ID: 21 }
            },
            {
              player1: { name: names[21] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[22] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs[0]
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              ...cloneplayer2Vs[1]
            },
            {
              player1: { name: names[6], winner: true, ID: 7 },
              ...cloneplayer2Vs[2]
            },
            {
              player1: { name: names[9], winner: true, ID: 10 },
              ...cloneplayer2Vs[3]
            },
            {
              player1: { name: names[12], winner: true, ID: 13 },
              ...cloneplayer2Vs[4]
            },
            {
              ...cloneplayer1Vs,
              player2: { name: names[17], winner: true, ID: 18 },
            },
            {
              player1: { name: names[18], winner: true, ID: 19 },
              ...cloneplayer2Vs[5]
            },
            {
              player1: { name: names[21], winner: true, ID: 22 },
              player2: { name: names[22], winner: true, ID: 23 }
            },
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3]
          ],
          [cloneroundsDummy[4], cloneroundsDummy[5]],
          [cloneroundsDummy[6]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 25) {
        let cloneroundsDummy = cloneRoundsDummyfn(9, 7);

        let cloneplayer2Vs = [];
        for (let index = 0; index < 6; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
        }
        cloneplayer2Vs[0].player2.matchDate = matchSchedule[1];
        cloneplayer2Vs[1].player2.matchDate = matchSchedule[3];
        cloneplayer2Vs[2].player2.matchDate = matchSchedule[5];
        cloneplayer2Vs[3].player2.matchDate = matchSchedule[6];
        cloneplayer2Vs[4].player2.matchDate = matchSchedule[7];
        cloneplayer2Vs[5].player2.matchDate = matchSchedule[8];

        let cloneplayer1Vs = [];
        for (let index = 0; index < 3; index++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
        }
        cloneplayer1Vs[0].player1.matchDate = matchSchedule[0];
        cloneplayer1Vs[1].player1.matchDate = matchSchedule[2];
        cloneplayer1Vs[2].player1.matchDate = matchSchedule[4];

        var rounds = [
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              player2: { name: names[1], winner: true, ID: 2 },
            },
            {
              player1: { name: names[2], winner: true, ID: 3 },
              player2: { name: names[3], winner: true, ID: 4 }
            },
            {
              player1: { name: names[4], winner: true, ID: 5 },
              player2: { name: names[5], winner: true, ID: 6 }
            },
            {
              player1: { name: names[6] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[7] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[8], winner: true, ID: 9 },
              player2: { name: names[9], winner: true, ID: 10 },
            },
            {
              player1: { name: names[10], winner: true, ID: 11 },
              player2: { name: names[11], winner: true, ID: 12 },
            },
            {
              player1: { name: names[12] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[13] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[14], winner: true, ID: 15 },
              player2: { name: names[15], winner: true, ID: 16 },
            },
            {
              player1: { name: names[16] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[17], winner: true, ID: 18 },
              player2: { name: names[18], winner: true, ID: 19 },
            },
            {
              player1: { name: names[19] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[20], winner: true, ID: 21 },
              player2: { name: names[21], winner: true, ID: 22 },
            },
            {
              player1: { name: names[22] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[23], winner: true, ID: 24 },
              player2: { name: names[24], winner: true, ID: 25 },
            },
          ],
          [
            {
              ...cloneplayer1Vs[0],
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs[1],
              player2: { name: names[6], winner: true, ID: 7 },
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              ...cloneplayer2Vs[1]
            },
            {
              ...cloneplayer1Vs[2],
              player2: { name: names[12], winner: true, ID: 13 },
            },
            {
              player1: { name: names[13], winner: true, ID: 14 },
              ...cloneplayer2Vs[2]
            },
            {
              player1: { name: names[16], winner: true, ID: 17 },
              ...cloneplayer2Vs[3]
            },
            {
              player1: { name: names[19], winner: true, ID: 20 },
              ...cloneplayer2Vs[4]
            },
            {
              player1: { name: names[22], winner: true, ID: 23 },
              ...cloneplayer2Vs[5]
            }
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3]
          ],
          [cloneroundsDummy[4], cloneroundsDummy[5]],
          [cloneroundsDummy[6]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 27) {
        let cloneroundsDummy = cloneRoundsDummyfn(11, 7);

        let cloneplayer1Vs = [];
        for (let index = 0; index < 5; index++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
        }
        cloneplayer1Vs[0].player1.matchDate = matchSchedule[1];
        cloneplayer1Vs[1].player1.matchDate = matchSchedule[3];
        cloneplayer1Vs[2].player1.matchDate = matchSchedule[5];
        cloneplayer1Vs[3].player1.matchDate = matchSchedule[7];
        cloneplayer1Vs[4].player1.matchDate = matchSchedule[10];

        let cloneplayer2Vs = [];
        for (let index = 0; index < 6; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
        }
        cloneplayer2Vs[0].player2.matchDate = matchSchedule[0];
        cloneplayer2Vs[1].player2.matchDate = matchSchedule[2];
        cloneplayer2Vs[2].player2.matchDate = matchSchedule[4];
        cloneplayer2Vs[3].player2.matchDate = matchSchedule[6];
        cloneplayer2Vs[4].player2.matchDate = matchSchedule[8];
        cloneplayer2Vs[5].player2.matchDate = matchSchedule[9];

        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              player2: { name: names[4], winner: true, ID: 5 },
            },
            {
              player1: { name: names[5], winner: true, ID: 6 },
              player2: { name: names[6], winner: true, ID: 7 },
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              player2: { name: names[8], winner: true, ID: 9 },
            },
            {
              player1: { name: names[9], winner: true, ID: 10 },
              player2: { name: names[10], winner: true, ID: 11 },
            },
            {
              player1: { name: names[11], winner: true, ID: 12 },
              player2: { name: names[12], winner: true, ID: 13 },
            },
            {
              player1: { name: names[13] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[14] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[15], winner: true, ID: 16 },
              player2: { name: names[16], winner: true, ID: 17 },
            },
            {
              player1: { name: names[17], winner: true, ID: 18 },
              player2: { name: names[18], winner: true, ID: 19 },
            },
            {
              player1: { name: names[19], winner: true, ID: 20 },
              player2: { name: names[20], winner: true, ID: 21 },
            },
            {
              player1: { name: names[21] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[22], winner: true, ID: 23 },
              player2: { name: names[23], winner: true, ID: 24 },
            },
            {
              player1: { name: names[24], winner: true, ID: 25 },
              player2: { name: names[25], winner: true, ID: 26 },
            },
            {
              player1: { name: names[26] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            }
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs[0],
              ...cloneplayer2Vs[1]
            },
            {
              ...cloneplayer1Vs[1],
              ...cloneplayer2Vs[2]
            },
            {
              ...cloneplayer1Vs[2],
              player2: { name: names[13], winner: true, ID: 14 },
            },
            {
              player1: { name: names[14], winner: true, ID: 15 },
              ...cloneplayer2Vs[3],
            },
            {
              ...cloneplayer1Vs[3],
              ...cloneplayer2Vs[4]
            },
            {
              player1: { name: names[21], winner: true, ID: 22 },
              ...cloneplayer2Vs[5]
            },
            {
              ...cloneplayer1Vs[4],
              player2: { name: names[26], winner: true, ID: 27 },
            }
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3]
          ],
          [cloneroundsDummy[4], cloneroundsDummy[5]],
          [cloneroundsDummy[6]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 29) {
        let cloneroundsDummy = cloneRoundsDummyfn(13, 7);

        let cloneplayer1Vs = [];
        for (let index = 0; index < 5; index++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
          if (index > 4)
            cloneplayer1Vs[index].player1.matchDate = matchSchedule[index * 3 + 1];
        }
        cloneplayer1Vs[0].player1.matchDate = matchSchedule[1];
        cloneplayer1Vs[1].player1.matchDate = matchSchedule[3];
        cloneplayer1Vs[2].player1.matchDate = matchSchedule[5];
        cloneplayer1Vs[3].player1.matchDate = matchSchedule[8];
        cloneplayer1Vs[4].player1.matchDate = matchSchedule[11];

        let cloneplayer2Vs = [];
        for (let index = 0; index < 8; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
        }
        cloneplayer2Vs[0].player2.matchDate = matchSchedule[0];
        cloneplayer2Vs[1].player2.matchDate = matchSchedule[2];
        cloneplayer2Vs[2].player2.matchDate = matchSchedule[4];
        cloneplayer2Vs[3].player2.matchDate = matchSchedule[6];
        cloneplayer2Vs[4].player2.matchDate = matchSchedule[7];
        cloneplayer2Vs[5].player2.matchDate = matchSchedule[9];
        cloneplayer2Vs[6].player2.matchDate = matchSchedule[10];
        cloneplayer2Vs[7].player2.matchDate = matchSchedule[12];

        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              player2: { name: names[4], winner: true, ID: 5 },
            },
            {
              player1: { name: names[5], winner: true, ID: 6 },
              player2: { name: names[6], winner: true, ID: 7 },
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              player2: { name: names[8], winner: true, ID: 9 },
            },
            {
              player1: { name: names[9], winner: true, ID: 10 },
              player2: { name: names[10], winner: true, ID: 11 },
            },
            {
              player1: { name: names[11], winner: true, ID: 12 },
              player2: { name: names[12], winner: true, ID: 13 },
            },
            {
              player1: { name: names[13], winner: true, ID: 14 },
              player2: { name: names[14], winner: true, ID: 15 },
            },
            {
              player1: { name: names[15] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[16], winner: true, ID: 17 },
              player2: { name: names[17], winner: true, ID: 18 },
            },
            {
              player1: { name: names[18], winner: true, ID: 19 },
              player2: { name: names[19], winner: true, ID: 20 },
            },
            {
              player1: { name: names[20], winner: true, ID: 21 },
              player2: { name: names[21], winner: true, ID: 22 },
            },
            {
              player1: { name: names[22] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[23], winner: true, ID: 24 },
              player2: { name: names[24], winner: true, ID: 25 },
            },
            {
              player1: { name: names[25], winner: true, ID: 26 },
              player2: { name: names[26], winner: true, ID: 27 },
            },
            {
              player1: { name: names[27], winner: true, ID: 28 },
              player2: { name: names[28], winner: true, ID: 29 },
            },
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs[0],
            },
            {
              ...cloneplayer1Vs[0],
              ...cloneplayer2Vs[1]
            },
            {
              ...cloneplayer1Vs[1],
              ...cloneplayer2Vs[2]
            },
            {
              ...cloneplayer1Vs[2],
              ...cloneplayer2Vs[3]
            },
            {
              player1: { name: names[15], winner: true, ID: 16 },
              ...cloneplayer2Vs[4]
            },
            {
              ...cloneplayer1Vs[3],
              ...cloneplayer2Vs[5]
            },
            {
              player1: { name: names[22], winner: true, ID: 23 },
              ...cloneplayer2Vs[6]
            },
            {
              ...cloneplayer1Vs[4],
              ...cloneplayer2Vs[7]
            },
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3]
          ],
          [cloneroundsDummy[4], cloneroundsDummy[5]],
          [cloneroundsDummy[6]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 31) {
        let cloneroundsDummy = cloneRoundsDummyfn(15, 7);

        let cloneplayer1Vs = [];
        for (let index = 0, indexY = -1; index < 8; index++, indexY++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
          cloneplayer1Vs[index].player1.matchDate = matchSchedule[++indexY];
        }

        let cloneplayer2Vs = [];
        for (let index = 0, indexY = 0; index < 7; index++, indexY++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
          cloneplayer2Vs[index].player2.matchDate = matchSchedule[++indexY];
        }

        var rounds = [
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              player2: { name: names[1], winner: true, ID: 2 },
            },
            {
              player1: { name: names[2], winner: true, ID: 3 },
              player2: { name: names[3], winner: true, ID: 4 },
            },
            {
              player1: { name: names[4], winner: true, ID: 5 },
              player2: { name: names[5], winner: true, ID: 6 }
            },
            {
              player1: { name: names[6], winner: true, ID: 7 },
              player2: { name: names[7], winner: true, ID: 8 },
            },
            {
              player1: { name: names[8], winner: true, ID: 9 },
              player2: { name: names[9], winner: true, ID: 10 },
            },
            {
              player1: { name: names[10], winner: true, ID: 11 },
              player2: { name: names[11], winner: true, ID: 12 },
            },
            {
              player1: { name: names[12], winner: true, ID: 13 },
              player2: { name: names[13], winner: true, ID: 14 }
            },
            {
              player1: { name: names[14], winner: true, ID: 15 },
              player2: { name: names[15], winner: true, ID: 16 },
            },
            {
              player1: { name: names[16], winner: true, ID: 17 },
              player2: { name: names[17], winner: true, ID: 18 },
            },
            {
              player1: { name: names[18], winner: true, ID: 19 },
              player2: { name: names[19], winner: true, ID: 20 },
            },
            {
              player1: { name: names[20], winner: true, ID: 21 },
              player2: { name: names[21], winner: true, ID: 22 }
            },
            {
              player1: { name: names[22], winner: true, ID: 23 },
              player2: { name: names[23], winner: true, ID: 24 },
            },
            {
              player1: { name: names[24], winner: true, ID: 25 },
              player2: { name: names[25], winner: true, ID: 26 },
            },
            {
              player1: { name: names[26], winner: true, ID: 27 },
              player2: { name: names[27], winner: true, ID: 28 }
            },
            {
              player1: { name: names[28], winner: true, ID: 29 },
              player2: { name: names[29], winner: true, ID: 30 }
            },
            {
              player1: { name: names[30] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
          ],
          [
            {
              ...cloneplayer1Vs[0],
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs[1],
              ...cloneplayer2Vs[1]
            },
            {
              ...cloneplayer1Vs[2],
              ...cloneplayer2Vs[2]
            },
            {
              ...cloneplayer1Vs[3],
              ...cloneplayer2Vs[3]
            },
            {
              ...cloneplayer1Vs[4],
              ...cloneplayer2Vs[4]
            },
            {
              ...cloneplayer1Vs[5],
              ...cloneplayer2Vs[5]
            },
            {
              ...cloneplayer1Vs[6],
              ...cloneplayer2Vs[6]
            },
            {
              ...cloneplayer1Vs[7],
              player2: { name: names[30], winner: true, ID: 31 },
            }
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3]
          ],
          [cloneroundsDummy[4], cloneroundsDummy[5]],
          [cloneroundsDummy[6]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 33) {
        let rounds = [];
        let cloneroundsDummy = cloneRoundsDummyfn(1, 15);

        var cloneplayer2Vs = JSON.parse(JSON.stringify(player2Vs));
        cloneplayer2Vs.player2.matchDate = matchSchedule[0];

        var round1 = playerMatch(17, 18, teamSize);
        let clonePlayerVsInit = round2ClonePlayersInitfn((teamSize / 2) / 2);
        var round2 = round2ClonePlayersVsfn(clonePlayerVsInit, (teamSize / 2) / 2);

        rounds.push([
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            {
              player1: { name: names[3] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[4] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[5] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[6] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[7] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[8] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[9] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[10] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[11] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[12] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[13] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[14] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[15] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[16] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[17] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[18] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[19] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[20] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[21] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[22] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[23] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[24] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[25] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[26] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[27] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[28] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[29] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[30] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[31] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[32] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 0 },
              ...cloneplayer2Vs,
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              player2: { name: names[4], winner: true, ID: 5 },
            },
            {
              player1: { name: names[5], winner: true, ID: 6 },
              player2: { name: names[6], winner: true, ID: 7 },
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              player2: { name: names[8], winner: true, ID: 9 },
            },
            {
              player1: { name: names[9], winner: true, ID: 10 },
              player2: { name: names[10], winner: true, ID: 11 },
            },
            {
              player1: { name: names[11], winner: true, ID: 12 },
              player2: { name: names[12], winner: true, ID: 13 },
            },
            {
              player1: { name: names[13], winner: true, ID: 14 },
              player2: { name: names[14], winner: true, ID: 15 },
            },
            {
              player1: { name: names[15], winner: true, ID: 16 },
              player2: { name: names[16], winner: true, ID: 17 },
            },
            ...round1
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        ]
        );
        return rounds[0];
      }
      else if (teamSize == 35) {
        let cloneroundsDummy = cloneRoundsDummyfn(3, 15);

        let cloneplayer2Vs = [];
        for (let index = 0; index < 2; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
          cloneplayer2Vs[index].player2.matchDate = matchSchedule[index];
        }

        let player1Loop = [[], []];
        for (let index1 = 3, index2 = 12; index1 < 10 && index2 < 18; index1++, index2++) {
          player1Loop[0].push({
            player1: { name: names[index1] + `(Bye)`, winner: true, ID: 101 },
            ...round1ByePlr2
          });
          player1Loop[1].push({
            player1: { name: names[index2] + `(Bye)`, winner: true, ID: 101 },
            ...round1ByePlr2
          });
        }

        var cloneplayer2Vs1 = JSON.parse(JSON.stringify(player2Vs));
        cloneplayer2Vs1.player2.matchDate = matchSchedule[2];

        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            ...player1Loop[0],
            {
              player1: { name: names[9] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[10], winner: true, ID: 11 },
              player2: { name: names[11], winner: true, ID: 12 },
            },
            ...player1Loop[1],
            {
              player1: { name: names[18] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[19], winner: true, ID: 20 },
              player2: { name: names[20], winner: true, ID: 21 },
            },
            {
              player1: { name: names[21] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[22] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[23] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[24] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[25] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[26] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[27] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[28] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[29] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[30] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[31] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[32] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[33] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[34] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs[0],
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              player2: { name: names[4], winner: true, ID: 5 },
            },
            {
              player1: { name: names[5], winner: true, ID: 6 },
              player2: { name: names[6], winner: true, ID: 7 },
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              player2: { name: names[8], winner: true, ID: 9 },
            },
            {
              player1: { name: names[9], winner: true, ID: 10 },
              ...cloneplayer2Vs[1],
            },
            {
              player1: { name: names[12], winner: true, ID: 13 },
              player2: { name: names[13], winner: true, ID: 14 },
            },
            {
              player1: { name: names[14], winner: true, ID: 15 },
              player2: { name: names[15], winner: true, ID: 16 },
            },
            {
              player1: { name: names[16], winner: true, ID: 17 },
              player2: { name: names[17], winner: true, ID: 18 },
            },
            {
              player1: { name: names[18], winner: true, ID: 19 },
              ...cloneplayer2Vs1,
            },
            {
              player1: { name: names[21], winner: true, ID: 22 },
              player2: { name: names[22], winner: true, ID: 23 },
            },
            {
              player1: { name: names[23], winner: true, ID: 24 },
              player2: { name: names[24], winner: true, ID: 25 },
            },
            {
              player1: { name: names[25], winner: true, ID: 26 },
              player2: { name: names[26], winner: true, ID: 27 },
            },
            {
              player1: { name: names[27], winner: true, ID: 28 },
              player2: { name: names[28], winner: true, ID: 29 },
            },
            {
              player1: { name: names[29], winner: true, ID: 30 },
              player2: { name: names[30], winner: true, ID: 31 },
            },
            {
              player1: { name: names[31], winner: true, ID: 32 },
              player2: { name: names[32], winner: true, ID: 33 },
            },
            {
              player1: { name: names[33], winner: true, ID: 34 },
              player2: { name: names[34], winner: true, ID: 35 },
            }
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 37) {
        let cloneroundsDummy = cloneRoundsDummyfn(5, 15);

        let cloneplayer2Vs = [];
        for (let index = 0; index < 2; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
          cloneplayer2Vs[index].player2.matchDate = matchSchedule[index];
        }

        var cloneplayer1Vs = JSON.parse(JSON.stringify(player1Vs));
        cloneplayer1Vs.player1.matchDate = matchSchedule[2];


        let cloneplayer2Vs1 = [];
        for (let index = 0; index < 2; index++) {
          cloneplayer2Vs1.push(JSON.parse(JSON.stringify(player2Vs)));
          cloneplayer2Vs1[index].player2.matchDate = matchSchedule[index + 3];
        }

        let player1Loop = [[], []];
        for (let index1 = 22, index2 = 31; index1 < 29 && index2 < 37; index1++, index2++) {
          player1Loop[0].push({
            player1: { name: names[index1] + `(Bye)`, ID: 101 },
            ...round1ByePlr2
          });
          player1Loop[1].push({
            player1: { name: names[index2] + `(Bye)`, ID: 101 },
            ...round1ByePlr2
          });
        }

        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            {
              player1: { name: names[3] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[4] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[5] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[6], winner: true, ID: 7 },
              player2: { name: names[7], winner: true, ID: 8 },
            },
            {
              player1: { name: names[8] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[9] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[10], winner: true, ID: 11 },
              player2: { name: names[11], winner: true, ID: 12 },
            },
            {
              player1: { name: names[12] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[13] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[14] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[15] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[16] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[17] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[18] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[19] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[20], winner: true, ID: 21 },
              player2: { name: names[21], winner: true, ID: 22 },
            },
            ...player1Loop[0],
            {
              player1: { name: names[28] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[29], winner: true, ID: 30 },
              player2: { name: names[30], winner: true, ID: 31 },
            },
            ...player1Loop[1]
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs[0]
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              player2: { name: names[4], winner: true, ID: 5 },
            },
            {
              player1: { name: names[5], winner: true, ID: 6 },
              ...cloneplayer2Vs[1]
            },
            {
              player1: { name: names[8], winner: true, ID: 9 },
              player2: { name: names[9], winner: true, ID: 10 },
            },
            {
              ...cloneplayer1Vs,
              player2: { name: names[12], winner: true, ID: 13 },
            },
            {
              player1: { name: names[13], winner: true, ID: 14 },
              player2: { name: names[14], winner: true, ID: 15 },
            },
            {
              player1: { name: names[15], winner: true, ID: 16 },
              player2: { name: names[16], winner: true, ID: 17 },
            },
            {
              player1: { name: names[17], winner: true, ID: 18 },
              player2: { name: names[18], winner: true, ID: 19 },
            },
            {
              player1: { name: names[19], winner: true, ID: 20 },
              ...cloneplayer2Vs1[0],
            },
            {
              player1: { name: names[22], winner: true, ID: 23 },
              player2: { name: names[23], winner: true, ID: 24 },
            },
            {
              player1: { name: names[24], winner: true, ID: 25 },
              player2: { name: names[25], winner: true, ID: 26 },
            },
            {
              player1: { name: names[26], winner: true, ID: 27 },
              player2: { name: names[27], winner: true, ID: 28 },
            },
            {
              player1: { name: names[28], winner: true, ID: 39 },
              ...cloneplayer2Vs1[1],
            },
            {
              player1: { name: names[31], winner: true, ID: 32 },
              player2: { name: names[32], winner: true, ID: 33 },
            },
            {
              player1: { name: names[33], winner: true, ID: 34 },
              player2: { name: names[34], winner: true, ID: 35 },
            },
            {
              player1: { name: names[35], winner: true, ID: 36 },
              player2: { name: names[36], winner: true, ID: 37 },
            }
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 39) {
        let cloneroundsDummy = cloneRoundsDummyfn(7, 15);

        let cloneplayer2Vs = [];
        for (let index = 0; index < 2; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
          cloneplayer2Vs[index].player2.matchDate = matchSchedule[index + 4];
        }

        var cloneplayer1Vs = JSON.parse(JSON.stringify(player1Vs));
        cloneplayer1Vs.player1.matchDate = matchSchedule[6];

        let rounds = [[], []];
        let number1 = 0, number2 = 0;
        while (number1 < 4) {
          rounds[0].push(...team5Round1(number2));
          rounds[1].push(...team5Round2(number2, number1));
          number2 += 5;
          ++number1;
        }
        rounds[0].push(
          {
            player1: { name: names[20] + `(Bye)`, winner: true, ID: 101 },
            ...round1ByePlr2
          },
          {
            player1: { name: names[21], winner: true, ID: 22 },
            player2: { name: names[22], winner: true, ID: 23 },
          },
          {
            player1: { name: names[23] + `(Bye)`, winner: true, ID: 101 },
            ...round1ByePlr2
          },
          {
            player1: { name: names[24] + `(Bye)`, winner: true, ID: 101 },
            ...round1ByePlr2
          },
          {
            player1: { name: names[25] + `(Bye)`, winner: true, ID: 101 },
            ...round1ByePlr2
          },
          {
            player1: { name: names[26], winner: true, ID: 27 },
            player2: { name: names[27], winner: true, ID: 28 },
          },
          {
            player1: { name: names[28] + `(Bye)`, winner: true, ID: 101 },
            ...round1ByePlr2
          },
          {
            player1: { name: names[29] + `(Bye)`, winner: true, ID: 101 },
            ...round1ByePlr2
          },
          {
            player1: { name: names[30], winner: true, ID: 31 },
            player2: { name: names[31], winner: true, ID: 32 },
          },
          {
            player1: { name: names[32] + `(Bye)`, winner: true, ID: 101 },
            ...round1ByePlr2
          },
          {
            player1: { name: names[33] + `(Bye)`, winner: true, ID: 101 },
            ...round1ByePlr2
          },
          {
            player1: { name: names[34] + `(Bye)`, winner: true, ID: 101 },
            ...round1ByePlr2
          },
          {
            player1: { name: names[35] + `(Bye)`, winner: true, ID: 101 },
            ...round1ByePlr2
          },
          {
            player1: { name: names[36] + `(Bye)`, winner: true, ID: 101 },
            ...round1ByePlr2
          },
          {
            player1: { name: names[37] + `(Bye)`, winner: true, ID: 101 },
            ...round1ByePlr2
          },
          {
            player1: { name: names[38] + `(Bye)`, winner: true, ID: 101 },
            ...round1ByePlr2
          }
        );
        rounds[1].push(
          {
            player1: { name: names[20], winner: true, ID: 21 },
            ...cloneplayer2Vs[0]
          },
          {
            player1: { name: names[23], winner: true, ID: 24 },
            player2: { name: names[24], winner: true, ID: 25 },
          },
          {
            player1: { name: names[25], winner: true, ID: 26 },
            ...cloneplayer2Vs[1]
          },
          {
            player1: { name: names[28], winner: true, ID: 29 },
            player2: { name: names[29], winner: true, ID: 30 },
          },
          {
            ...cloneplayer1Vs,
            player2: { name: names[32], winner: true, ID: 33 },
          },
          {
            player1: { name: names[33], winner: true, ID: 34 },
            player2: { name: names[34], winner: true, ID: 35 },
          },
          {
            player1: { name: names[35], winner: true, ID: 36 },
            player2: { name: names[36], winner: true, ID: 37 },
          },
          {
            player1: { name: names[37], winner: true, ID: 38 },
            player2: { name: names[38], winner: true, ID: 39 },
          }
        )
        rounds.push([
          cloneroundsDummy[0],
          cloneroundsDummy[1],
          cloneroundsDummy[2],
          cloneroundsDummy[3],
          cloneroundsDummy[4],
          cloneroundsDummy[5],
          cloneroundsDummy[6],
          cloneroundsDummy[7]
        ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        );
        console.log(rounds)
        return rounds;
      }
      else if (teamSize == 41) {
        let cloneroundsDummy = cloneRoundsDummyfn(9, 15);

        let cloneplayer2Vs = [];
        for (let index = 0; index < 4; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
          if (index > 0)
            cloneplayer2Vs[index].player2.matchDate = matchSchedule[index + 1];
        }
        cloneplayer2Vs[0].player2.matchDate = matchSchedule[0];
        var cloneplayer1Vs = JSON.parse(JSON.stringify(player1Vs));
        cloneplayer1Vs.player1.matchDate = matchSchedule[1];

        let round1 = [];
        let round2 = [];
        let number1 = 5, number2 = 21;
        while (number1 < 9) {
          round1.push(...team5Round1(number2));
          round2.push(...team5Round2(number2, number1));
          number2 += 5;
          ++number1;
        }

        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              player2: { name: names[4], winner: true, ID: 5 },
            },
            {
              player1: { name: names[5] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[6] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              player2: { name: names[8], winner: true, ID: 9 }
            },
            {
              player1: { name: names[9] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[10] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[11] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[12], winner: true, ID: 13 },
              player2: { name: names[13], winner: true, ID: 14 },
            },
            {
              player1: { name: names[14] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[15] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[16] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[17], winner: true, ID: 18 },
              player2: { name: names[18], winner: true, ID: 19 },
            },
            {
              player1: { name: names[19] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[20] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            ...round1
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs,
              player2: { name: names[5], winner: true, ID: 6 },
            },
            {
              player1: { name: names[6], winner: true, ID: 7 },
              ...cloneplayer2Vs[1]
            },
            {
              player1: { name: names[9], winner: true, ID: 10 },
              player2: { name: names[10], winner: true, ID: 11 }
            },
            {
              player1: { name: names[11], winner: true, ID: 12 },
              ...cloneplayer2Vs[2]
            },
            {
              player1: { name: names[14], winner: true, ID: 15 },
              player2: { name: names[15], winner: true, ID: 16 },
            },
            {
              player1: { name: names[16], winner: true, ID: 17 },
              ...cloneplayer2Vs[3]
            },
            {
              player1: { name: names[19], winner: true, ID: 20 },
              player2: { name: names[20], winner: true, ID: 21 },
            },
            ...round2
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 43) {
        let cloneroundsDummy = cloneRoundsDummyfn(11, 15);

        let cloneplayer2Vs = [];
        for (let index = 0; index < 4; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
        }
        cloneplayer2Vs[0].player2.matchDate = matchSchedule[0];
        cloneplayer2Vs[1].player2.matchDate = matchSchedule[2];
        cloneplayer2Vs[2].player2.matchDate = matchSchedule[3];
        cloneplayer2Vs[3].player2.matchDate = matchSchedule[5];

        let cloneplayer1Vs = [];
        for (let index = 0; index < 2; index++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
        }
        cloneplayer1Vs[0].player1.matchDate = matchSchedule[1];
        cloneplayer1Vs[1].player1.matchDate = matchSchedule[4];

        let cloneplayer2Vs1 = [];
        for (let index = 0; index < 4; index++) {
          cloneplayer2Vs1.push(JSON.parse(JSON.stringify(player2Vs)));
          if (index > 0)
            cloneplayer2Vs1[index].player2.matchDate = matchSchedule[index + 7];
        }
        cloneplayer2Vs1[0].player2.matchDate = matchSchedule[6];

        var cloneplayer1Vs1 = JSON.parse(JSON.stringify(player1Vs));
        cloneplayer1Vs1.player1.matchDate = matchSchedule[7];


        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              player2: { name: names[4], winner: true, ID: 5 },
            },
            {
              player1: { name: names[5] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[6] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              player2: { name: names[8], winner: true, ID: 9 }
            },
            {
              player1: { name: names[9] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[10] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[11] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[12], winner: true, ID: 13 },
              player2: { name: names[13], winner: true, ID: 14 },
            },
            {
              player1: { name: names[14], winner: true, ID: 15 },
              player2: { name: names[15], winner: true, ID: 16 },
            },
            {
              player1: { name: names[16] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[17] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[18], winner: true, ID: 19 },
              player2: { name: names[19], winner: true, ID: 20 }
            },
            {
              player1: { name: names[20] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[21] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[22] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[23], winner: true, ID: 24 },
              player2: { name: names[24], winner: true, ID: 25 },
            },
            {
              player1: { name: names[25], winner: true, ID: 26 },
              player2: { name: names[26], winner: true, ID: 27 },
            },
            {
              player1: { name: names[27] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[28] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[29], winner: true, ID: 30 },
              player2: { name: names[30], winner: true, ID: 31 }
            },
            {
              player1: { name: names[31] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[32] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[33] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[34], winner: true, ID: 35 },
              player2: { name: names[35], winner: true, ID: 36 },
            },
            {
              player1: { name: names[36] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[37] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[38] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[39], winner: true, ID: 40 },
              player2: { name: names[40], winner: true, ID: 41 },
            },
            {
              player1: { name: names[41] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[42] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs[0],
              player2: { name: names[5], winner: true, ID: 6 },
            },
            {
              player1: { name: names[6], winner: true, ID: 7 },
              ...cloneplayer2Vs[1]
            },
            {
              player1: { name: names[9], winner: true, ID: 10 },
              player2: { name: names[10], winner: true, ID: 11 }
            },
            {
              player1: { name: names[11], winner: true, ID: 12 },
              ...cloneplayer2Vs[2]
            },
            {
              ...cloneplayer1Vs[1],
              player2: { name: names[16], winner: true, ID: 17 },
            },
            {
              player1: { name: names[17], winner: true, ID: 18 },
              ...cloneplayer2Vs[3]
            },
            {
              player1: { name: names[20], winner: true, ID: 21 },
              player2: { name: names[21], winner: true, ID: 22 }
            },
            {
              player1: { name: names[22], winner: true, ID: 23 },
              ...cloneplayer2Vs1[0]
            },
            {
              ...cloneplayer1Vs1,
              player2: { name: names[27], winner: true, ID: 28 },
            },
            {
              player1: { name: names[28], winner: true, ID: 29 },
              ...cloneplayer2Vs1[1]
            },
            {
              player1: { name: names[31], winner: true, ID: 32 },
              player2: { name: names[32], winner: true, ID: 33 }
            },
            {
              player1: { name: names[33], winner: true, ID: 34 },
              ...cloneplayer2Vs1[2]
            },
            {
              player1: { name: names[36], winner: true, ID: 37 },
              player2: { name: names[37], winner: true, ID: 38 },
            },
            {
              player1: { name: names[38], winner: true, ID: 39 },
              ...cloneplayer2Vs1[3]
            },
            {
              player1: { name: names[41], winner: true, ID: 42 },
              player2: { name: names[42], winner: true, ID: 43 },
            },
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 45) {
        let cloneroundsDummy = cloneRoundsDummyfn(13, 15);

        let cloneplayer2Vs = [];
        for (let index = 0; index < 5; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
          cloneplayer2Vs[index].player2.matchDate = matchSchedule[index];
        }
        cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
        cloneplayer2Vs[5].player2.matchDate = matchSchedule[6];

        let cloneplayer1Vs = JSON.parse(JSON.stringify(player1Vs));
        cloneplayer1Vs.player1.matchDate = matchSchedule[5];


        let cloneplayer2Vs1 = [];
        for (let index = 0; index < 4; index++) {
          cloneplayer2Vs1.push(JSON.parse(JSON.stringify(player2Vs)));
        }
        cloneplayer2Vs1[0].player2.matchDate = matchSchedule[7];
        cloneplayer2Vs1[1].player2.matchDate = matchSchedule[9];
        cloneplayer2Vs1[2].player2.matchDate = matchSchedule[10];
        cloneplayer2Vs1[3].player2.matchDate = matchSchedule[12];

        let cloneplayer1Vs1 = [];
        for (let index = 0; index < 2; index++) {
          cloneplayer1Vs1.push(JSON.parse(JSON.stringify(player1Vs)));
        }
        cloneplayer1Vs1[0].player1.matchDate = matchSchedule[8];
        cloneplayer1Vs1[1].player1.matchDate = matchSchedule[11];

        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            {
              player1: { name: names[3] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[4], winner: true, ID: 5 },
              player2: { name: names[5], winner: true, ID: 6 },
            },
            {
              player1: { name: names[6] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              player2: { name: names[8], winner: true, ID: 9 },
            },
            {
              player1: { name: names[9] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[10], winner: true, ID: 11 },
              player2: { name: names[11], winner: true, ID: 12 },
            },
            {
              player1: { name: names[12] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[13], winner: true, ID: 14 },
              player2: { name: names[14], winner: true, ID: 15 },
            },
            {
              player1: { name: names[15], winner: true, ID: 16 },
              player2: { name: names[16], winner: true, ID: 17 },
            },
            {
              player1: { name: names[17] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[18] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[19], winner: true, ID: 20 },
              player2: { name: names[20], winner: true, ID: 21 }
            },
            {
              player1: { name: names[21] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[22] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[23] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[24], winner: true, ID: 25 },
              player2: { name: names[25], winner: true, ID: 26 },
            },
            {
              player1: { name: names[26], winner: true, ID: 27 },
              player2: { name: names[27], winner: true, ID: 28 },
            },
            {
              player1: { name: names[28] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[29] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[30], winner: true, ID: 31 },
              player2: { name: names[31], winner: true, ID: 32 }
            },
            {
              player1: { name: names[32] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[33] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[34] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[35], winner: true, ID: 36 },
              player2: { name: names[36], winner: true, ID: 37 },
            },
            {
              player1: { name: names[37], winner: true, ID: 38 },
              player2: { name: names[38], winner: true, ID: 39 },
            },
            {
              player1: { name: names[39] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[40] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[41], winner: true, ID: 41 },
              player2: { name: names[42], winner: true, ID: 43 }
            },
            {
              player1: { name: names[43] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[44] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs[0]
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              ...cloneplayer2Vs[1]
            },
            {
              player1: { name: names[6], winner: true, ID: 7 },
              ...cloneplayer2Vs[2]
            },
            {
              player1: { name: names[9], winner: true, ID: 10 },
              ...cloneplayer2Vs[3]
            },
            {
              player1: { name: names[12], winner: true, ID: 13 },
              ...cloneplayer2Vs[4]
            },
            {
              ...cloneplayer1Vs,
              player2: { name: names[17], winner: true, ID: 18 },
            },
            {
              player1: { name: names[18], winner: true, ID: 19 },
              ...cloneplayer2Vs[5]
            },
            {
              player1: { name: names[21], winner: true, ID: 22 },
              player2: { name: names[22], winner: true, ID: 23 }
            },
            {
              player1: { name: names[23], winner: true, ID: 24 },
              ...cloneplayer2Vs1[0]
            },
            {
              ...cloneplayer1Vs1[0],
              player2: { name: names[28], winner: true, ID: 29 },
            },
            {
              player1: { name: names[29], winner: true, ID: 30 },
              ...cloneplayer2Vs1[1]
            },
            {
              player1: { name: names[32], winner: true, ID: 33 },
              player2: { name: names[33], winner: true, ID: 34 }
            },
            {
              player1: { name: names[34], winner: true, ID: 35 },
              ...cloneplayer2Vs1[2]
            },
            {
              ...cloneplayer1Vs1[1],
              player2: { name: names[39], winner: true, ID: 40 },
            },
            {
              player1: { name: names[40], winner: true, ID: 41 },
              ...cloneplayer2Vs1[3]
            },
            {
              player1: { name: names[43], winner: true, ID: 44 },
              player2: { name: names[44], winner: true, ID: 45 }
            },
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 47) {
        let cloneroundsDummy = cloneRoundsDummyfn(15, 15);

        let rounds = [];
        // LowerHalf
        let cloneplayer2Vs = [];
        for (let index = 0; index < 5; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
          cloneplayer2Vs[index].player2.matchDate = matchSchedule[index + 8];
        }
        cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
        cloneplayer2Vs[5].player2.matchDate = matchSchedule[14];

        let cloneplayer1Vs = JSON.parse(JSON.stringify(player1Vs));
        cloneplayer1Vs.player1.matchDate = matchSchedule[13];


        // UpperHalf
        let round1 = [];
        let round2 = [];
        let number1 = 0, number2 = 0;
        while (number1 < 8) {
          let round = team3Round1(number2, teamSize / 2);
          round1.push(...round);
          let round0 = team3Round2(number2, number1);
          round2.push(...round0);
          number2 += 3;
          ++number1;
        }
        rounds.push([
          ...round1,
          {
            player1: { name: names[24] + `(Bye)`, winner: true, ID: 101 },
            ...round1ByePlr2
          },
          {
            player1: { name: names[25], winner: true, ID: 26 },
            player2: { name: names[26], winner: true, ID: 27 },
          },
          {
            player1: { name: names[27] + `(Bye)`, winner: true, ID: 101 },
            ...round1ByePlr2
          },
          {
            player1: { name: names[28], winner: true, ID: 29 },
            player2: { name: names[29], winner: true, ID: 30 },
          },
          {
            player1: { name: names[30] + `(Bye)`, winner: true, ID: 101 },
            ...round1ByePlr2
          },
          {
            player1: { name: names[31], winner: true, ID: 32 },
            player2: { name: names[32], winner: true, ID: 33 },
          },
          {
            player1: { name: names[33] + `(Bye)`, winner: true, ID: 101 },
            ...round1ByePlr2
          },
          {
            player1: { name: names[34], winner: true, ID: 35 },
            player2: { name: names[35], winner: true, ID: 36 },
          },
          {
            player1: { name: names[36] + `(Bye)`, winner: true, ID: 101 },
            ...round1ByePlr2
          },
          {
            player1: { name: names[37], winner: true, ID: 38 },
            player2: { name: names[38], winner: true, ID: 39 },
          },
          {
            player1: { name: names[39], winner: true, ID: 40 },
            player2: { name: names[40], winner: true, ID: 41 },
          },
          {
            player1: { name: names[41] + `(Bye)`, winner: true, ID: 101 },
            ...round1ByePlr2
          },
          {
            player1: { name: names[42] + `(Bye)`, winner: true, ID: 101 },
            ...round1ByePlr2
          },
          {
            player1: { name: names[43], winner: true, ID: 44 },
            player2: { name: names[44], winner: true, ID: 45 }
          },
          {
            player1: { name: names[45] + `(Bye)`, winner: true, ID: 101 },
            ...round1ByePlr2
          },
          {
            player1: { name: names[46] + `(Bye)`, winner: true, ID: 101 },
            ...round1ByePlr2
          },
        ]);
        rounds.push([
          ...round2,
          {
            player1: { name: names[24], winner: true, ID: 25 },
            ...cloneplayer2Vs[0]
          },
          {
            player1: { name: names[27], winner: true, ID: 28 },
            ...cloneplayer2Vs[1]
          },
          {
            player1: { name: names[30], winner: true, ID: 31 },
            ...cloneplayer2Vs[2]
          },
          {
            player1: { name: names[33], winner: true, ID: 34 },
            ...cloneplayer2Vs[3]
          },
          {
            player1: { name: names[36], winner: true, ID: 37 },
            ...cloneplayer2Vs[4]
          },
          {
            ...cloneplayer1Vs,
            player2: { name: names[41], winner: true, ID: 42 },
          },
          {
            player1: { name: names[42], winner: true, ID: 43 },
            ...cloneplayer2Vs[5]
          },
          {
            player1: { name: names[45], winner: true, ID: 46 },
            player2: { name: names[46], winner: true, ID: 47 }
          },
        ])
        rounds.push(
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        );
        return rounds;
      }
      else if (teamSize == 49) {
        let cloneroundsDummy = cloneRoundsDummyfn(17, 15);

        // UpperHalf
        let cloneplayer2Vs = [];
        for (let index = 0; index < 6; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
        }
        cloneplayer2Vs[0].player2.matchDate = matchSchedule[1];
        cloneplayer2Vs[1].player2.matchDate = matchSchedule[3];
        cloneplayer2Vs[2].player2.matchDate = matchSchedule[5];
        cloneplayer2Vs[3].player2.matchDate = matchSchedule[6];
        cloneplayer2Vs[4].player2.matchDate = matchSchedule[7];
        cloneplayer2Vs[5].player2.matchDate = matchSchedule[8];

        let cloneplayer1Vs = [];
        for (let index = 0; index < 3; index++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
        }
        cloneplayer1Vs[0].player1.matchDate = matchSchedule[0];
        cloneplayer1Vs[1].player1.matchDate = matchSchedule[2];
        cloneplayer1Vs[2].player1.matchDate = matchSchedule[4];

        // LowerHalf
        let round = [[], []];
        let number1 = 9, number2 = 25;
        while (number1 < 17) {
          let round1 = team3Round1(number2, teamSize / 2);
          round[0].push(...round1);
          let round2 = team3Round2(number2, number1);
          round[1].push(...round2);
          number2 += 3;
          ++number1;
        }

        var rounds = [
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              player2: { name: names[1], winner: true, ID: 2 },
            },
            {
              player1: { name: names[2], winner: true, ID: 3 },
              player2: { name: names[3], winner: true, ID: 4 }
            },
            {
              player1: { name: names[4], winner: true, ID: 5 },
              player2: { name: names[5], winner: true, ID: 6 }
            },
            {
              player1: { name: names[6] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[7] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[8], winner: true, ID: 9 },
              player2: { name: names[9], winner: true, ID: 10 },
            },
            {
              player1: { name: names[10], winner: true, ID: 11 },
              player2: { name: names[11], winner: true, ID: 12 },
            },
            {
              player1: { name: names[12] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[13] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[14], winner: true, ID: 15 },
              player2: { name: names[15], winner: true, ID: 16 },
            },
            {
              player1: { name: names[16] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[17], winner: true, ID: 18 },
              player2: { name: names[18], winner: true, ID: 19 },
            },
            {
              player1: { name: names[19] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[20], winner: true, ID: 21 },
              player2: { name: names[21], winner: true, ID: 22 },
            },
            {
              player1: { name: names[22] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[23], winner: true, ID: 24 },
              player2: { name: names[24], winner: true, ID: 25 },
            },
            ...round[0]
          ],
          [
            {
              ...cloneplayer1Vs[0],
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs[1],
              player2: { name: names[6], winner: true, ID: 7 },
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              ...cloneplayer2Vs[1]
            },
            {
              ...cloneplayer1Vs[2],
              player2: { name: names[12], winner: true, ID: 13 },
            },
            {
              player1: { name: names[13], winner: true, ID: 14 },
              ...cloneplayer2Vs[2]
            },
            {
              player1: { name: names[16], winner: true, ID: 17 },
              ...cloneplayer2Vs[3]
            },
            {
              player1: { name: names[19], winner: true, ID: 20 },
              ...cloneplayer2Vs[4]
            },
            {
              player1: { name: names[22], winner: true, ID: 23 },
              ...cloneplayer2Vs[5]
            },
            ...round[1]
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 51) {
        let cloneroundsDummy = cloneRoundsDummyfn(19, 15);

        // UpperHalf
        let cloneplayer2Vs = [];
        for (let index = 0; index < 4; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
        }
        cloneplayer2Vs[0].player2.matchDate = matchSchedule[1];
        cloneplayer2Vs[1].player2.matchDate = matchSchedule[3];
        cloneplayer2Vs[2].player2.matchDate = matchSchedule[6];
        cloneplayer2Vs[3].player2.matchDate = matchSchedule[8];

        let cloneplayer1Vs = [];
        for (let index = 0; index < 6; index++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
        }
        cloneplayer1Vs[0].player1.matchDate = matchSchedule[0];
        cloneplayer1Vs[1].player1.matchDate = matchSchedule[2];
        cloneplayer1Vs[2].player1.matchDate = matchSchedule[4];
        cloneplayer1Vs[3].player1.matchDate = matchSchedule[5];
        cloneplayer1Vs[4].player1.matchDate = matchSchedule[7];
        cloneplayer1Vs[5].player1.matchDate = matchSchedule[9];

        // LowerHalf
        let cloneplayer2Vs1 = [];
        for (let index = 0; index < 6; index++) {
          cloneplayer2Vs1.push(JSON.parse(JSON.stringify(player2Vs)));
        }
        cloneplayer2Vs1[0].player2.matchDate = matchSchedule[11];
        cloneplayer2Vs1[1].player2.matchDate = matchSchedule[13];
        cloneplayer2Vs1[2].player2.matchDate = matchSchedule[15];
        cloneplayer2Vs1[3].player2.matchDate = matchSchedule[16];
        cloneplayer2Vs1[4].player2.matchDate = matchSchedule[17];
        cloneplayer2Vs1[5].player2.matchDate = matchSchedule[18];

        let cloneplayer1Vs1 = [];
        for (let index = 0; index < 3; index++) {
          cloneplayer1Vs1.push(JSON.parse(JSON.stringify(player1Vs)));
        }
        cloneplayer1Vs1[0].player1.matchDate = matchSchedule[10];
        cloneplayer1Vs1[1].player1.matchDate = matchSchedule[12];
        cloneplayer1Vs1[2].player1.matchDate = matchSchedule[14];

        var rounds = [
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              player2: { name: names[1], winner: true, ID: 2 },
            },
            {
              player1: { name: names[2], winner: true, ID: 3 },
              player2: { name: names[3], winner: true, ID: 4 }
            },
            {
              player1: { name: names[4], winner: true, ID: 5 },
              player2: { name: names[5], winner: true, ID: 6 }
            },
            {
              player1: { name: names[6] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[7] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[8], winner: true, ID: 9 },
              player2: { name: names[9], winner: true, ID: 10 },
            },
            {
              player1: { name: names[10], winner: true, ID: 11 },
              player2: { name: names[11], winner: true, ID: 12 },
            },
            {
              player1: { name: names[12] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[13], winner: true, ID: 14 },
              player2: { name: names[14], winner: true, ID: 15 },
            },
            {
              player1: { name: names[15], winner: true, ID: 16 },
              player2: { name: names[16], winner: true, ID: 17 }
            },
            {
              player1: { name: names[17], winner: true, ID: 18 },
              player2: { name: names[18], winner: true, ID: 19 }
            },
            {
              player1: { name: names[19] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[20] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[21], winner: true, ID: 22 },
              player2: { name: names[22], winner: true, ID: 23 },
            },
            {
              player1: { name: names[23], winner: true, ID: 24 },
              player2: { name: names[24], winner: true, ID: 25 },
            },
            {
              player1: { name: names[25] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[26], winner: true, ID: 27 },
              player2: { name: names[27], winner: true, ID: 28 },
            },
            {
              player1: { name: names[28], winner: true, ID: 29 },
              player2: { name: names[29], winner: true, ID: 30 }
            },
            {
              player1: { name: names[30], winner: true, ID: 31 },
              player2: { name: names[31], winner: true, ID: 32 }
            },
            {
              player1: { name: names[32] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[33] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[34], winner: true, ID: 35 },
              player2: { name: names[35], winner: true, ID: 36 },
            },
            {
              player1: { name: names[36], winner: true, ID: 37 },
              player2: { name: names[37], winner: true, ID: 38 },
            },
            {
              player1: { name: names[38] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[39] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[40], winner: true, ID: 41 },
              player2: { name: names[41], winner: true, ID: 42 },
            },
            {
              player1: { name: names[42] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[43], winner: true, ID: 44 },
              player2: { name: names[44], winner: true, ID: 45 },
            },
            {
              player1: { name: names[45] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[46], winner: true, ID: 47 },
              player2: { name: names[47], winner: true, ID: 48 },
            },
            {
              player1: { name: names[48] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[49], winner: true, ID: 50 },
              player2: { name: names[50], winner: true, ID: 51 },
            },
          ],
          [
            {
              ...cloneplayer1Vs[0],
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs[1],
              player2: { name: names[6], winner: true, ID: 7 },
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              ...cloneplayer2Vs[1]
            },
            {
              ...cloneplayer1Vs[2],
              player2: { name: names[12], winner: true, ID: 13 },
            },
            {
              ...cloneplayer1Vs[3],
              ...cloneplayer2Vs[2]
            },
            {
              ...cloneplayer1Vs[4],
              player2: { name: names[19], winner: true, ID: 20 },
            },
            {
              player1: { name: names[20], winner: true, ID: 21 },
              ...cloneplayer2Vs[3]
            },
            {
              ...cloneplayer1Vs[5],
              player2: { name: names[25], winner: true, ID: 26 },
            },
            {
              ...cloneplayer1Vs1[0],
              ...cloneplayer2Vs1[0]
            },
            {
              ...cloneplayer1Vs1[1],
              player2: { name: names[32], winner: true, ID: 33 },
            },
            {
              player1: { name: names[33], winner: true, ID: 34 },
              ...cloneplayer2Vs1[1]
            },
            {
              ...cloneplayer1Vs1[2],
              player2: { name: names[38], winner: true, ID: 39 },
            },
            {
              player1: { name: names[39], winner: true, ID: 40 },
              ...cloneplayer2Vs1[2]
            },
            {
              player1: { name: names[42], winner: true, ID: 43 },
              ...cloneplayer2Vs1[3]
            },
            {
              player1: { name: names[45], winner: true, ID: 46 },
              ...cloneplayer2Vs1[4]
            },
            {
              player1: { name: names[48], winner: true, ID: 49 },
              ...cloneplayer2Vs1[5]
            }
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 53) {
        let cloneroundsDummy = cloneRoundsDummyfn(21, 15);

        // UpperHalf
        let cloneplayer1Vs = [];
        for (let index = 0; index < 5; index++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
        }
        cloneplayer1Vs[0].player1.matchDate = matchSchedule[1];
        cloneplayer1Vs[1].player1.matchDate = matchSchedule[3];
        cloneplayer1Vs[2].player1.matchDate = matchSchedule[5];
        cloneplayer1Vs[3].player1.matchDate = matchSchedule[7];
        cloneplayer1Vs[4].player1.matchDate = matchSchedule[10];

        let cloneplayer2Vs = [];
        for (let index = 0; index < 6; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
        }
        cloneplayer2Vs[0].player2.matchDate = matchSchedule[0];
        cloneplayer2Vs[1].player2.matchDate = matchSchedule[2];
        cloneplayer2Vs[2].player2.matchDate = matchSchedule[4];
        cloneplayer2Vs[3].player2.matchDate = matchSchedule[6];
        cloneplayer2Vs[4].player2.matchDate = matchSchedule[8];
        cloneplayer2Vs[5].player2.matchDate = matchSchedule[9];

        // LowerHalf
        let cloneplayer2Vs1 = [];
        for (let index = 0; index < 4; index++) {
          cloneplayer2Vs1.push(JSON.parse(JSON.stringify(player2Vs)));
        }
        cloneplayer2Vs1[0].player2.matchDate = matchSchedule[12];
        cloneplayer2Vs1[1].player2.matchDate = matchSchedule[14];
        cloneplayer2Vs1[2].player2.matchDate = matchSchedule[17];
        cloneplayer2Vs1[3].player2.matchDate = matchSchedule[19];

        let cloneplayer1Vs1 = [];
        for (let index = 0; index < 6; index++) {
          cloneplayer1Vs1.push(JSON.parse(JSON.stringify(player1Vs)));
        }
        cloneplayer1Vs1[0].player1.matchDate = matchSchedule[11];
        cloneplayer1Vs1[1].player1.matchDate = matchSchedule[13];
        cloneplayer1Vs1[2].player1.matchDate = matchSchedule[15];
        cloneplayer1Vs1[3].player1.matchDate = matchSchedule[16];
        cloneplayer1Vs1[4].player1.matchDate = matchSchedule[18];
        cloneplayer1Vs1[5].player1.matchDate = matchSchedule[20];

        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              player2: { name: names[4], winner: true, ID: 5 },
            },
            {
              player1: { name: names[5], winner: true, ID: 6 },
              player2: { name: names[6], winner: true, ID: 7 },
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              player2: { name: names[8], winner: true, ID: 9 },
            },
            {
              player1: { name: names[9], winner: true, ID: 10 },
              player2: { name: names[10], winner: true, ID: 11 },
            },
            {
              player1: { name: names[11], winner: true, ID: 12 },
              player2: { name: names[12], winner: true, ID: 13 },
            },
            {
              player1: { name: names[13] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[14] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[15], winner: true, ID: 16 },
              player2: { name: names[16], winner: true, ID: 17 },
            },
            {
              player1: { name: names[17], winner: true, ID: 18 },
              player2: { name: names[18], winner: true, ID: 19 },
            },
            {
              player1: { name: names[19], winner: true, ID: 20 },
              player2: { name: names[20], winner: true, ID: 21 },
            },
            {
              player1: { name: names[21] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[22], winner: true, ID: 23 },
              player2: { name: names[23], winner: true, ID: 24 },
            },
            {
              player1: { name: names[24], winner: true, ID: 25 },
              player2: { name: names[25], winner: true, ID: 26 },
            },
            {
              player1: { name: names[26] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[27], winner: true, ID: 28 },
              player2: { name: names[28], winner: true, ID: 29 },
            },
            {
              player1: { name: names[29], winner: true, ID: 30 },
              player2: { name: names[30], winner: true, ID: 31 }
            },
            {
              player1: { name: names[31], winner: true, ID: 32 },
              player2: { name: names[32], winner: true, ID: 33 }
            },
            {
              player1: { name: names[33] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[34] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[35], winner: true, ID: 36 },
              player2: { name: names[36], winner: true, ID: 37 },
            },
            {
              player1: { name: names[37], winner: true, ID: 38 },
              player2: { name: names[38], winner: true, ID: 39 },
            },
            {
              player1: { name: names[39] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[40], winner: true, ID: 41 },
              player2: { name: names[41], winner: true, ID: 42 },
            },
            {
              player1: { name: names[42], winner: true, ID: 43 },
              player2: { name: names[43], winner: true, ID: 44 }
            },
            {
              player1: { name: names[44], winner: true, ID: 45 },
              player2: { name: names[45], winner: true, ID: 46 }
            },
            {
              player1: { name: names[46] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[47] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[48], winner: true, ID: 49 },
              player2: { name: names[49], winner: true, ID: 50 },
            },
            {
              player1: { name: names[50], winner: true, ID: 51 },
              player2: { name: names[51], winner: true, ID: 52 },
            },
            {
              player1: { name: names[52] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            }
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs[0],
              ...cloneplayer2Vs[1]
            },
            {
              ...cloneplayer1Vs[1],
              ...cloneplayer2Vs[2]
            },
            {
              ...cloneplayer1Vs[2],
              player2: { name: names[13], winner: true, ID: 14 },
            },
            {
              player1: { name: names[14], winner: true, ID: 15 },
              ...cloneplayer2Vs[3],
            },
            {
              ...cloneplayer1Vs[3],
              ...cloneplayer2Vs[4]
            },
            {
              player1: { name: names[21], winner: true, ID: 22 },
              ...cloneplayer2Vs[5]
            },
            {
              ...cloneplayer1Vs[4],
              player2: { name: names[26], winner: true, ID: 27 },
            },
            {
              ...cloneplayer1Vs1[0],
              ...cloneplayer2Vs1[0]
            },
            {
              ...cloneplayer1Vs1[1],
              player2: { name: names[33], winner: true, ID: 34 },
            },
            {
              player1: { name: names[34], winner: true, ID: 35 },
              ...cloneplayer2Vs1[1]
            },
            {
              ...cloneplayer1Vs1[2],
              player2: { name: names[39], winner: true, ID: 40 },
            },
            {
              ...cloneplayer1Vs1[3],
              ...cloneplayer2Vs1[2]
            },
            {
              ...cloneplayer1Vs1[4],
              player2: { name: names[46], winner: true, ID: 47 },
            },
            {
              player1: { name: names[47], winner: true, ID: 48 },
              ...cloneplayer2Vs1[3]
            },
            {
              ...cloneplayer1Vs1[5],
              player2: { name: names[52], winner: true, ID: 53 },
            }
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 55) {
        let cloneroundsDummy = cloneRoundsDummyfn(23, 15);

        // UpperHalf
        let cloneplayer1Vs = [];
        for (let index = 0; index < 4; index++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
          cloneplayer1Vs[index].player1.matchDate = matchSchedule[index * 3 + 1];
        }

        let cloneplayer2Vs = [];
        for (let index = 0; index < 8; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
        }
        cloneplayer2Vs[0].player2.matchDate = matchSchedule[0];
        cloneplayer2Vs[1].player2.matchDate = matchSchedule[2];
        cloneplayer2Vs[2].player2.matchDate = matchSchedule[3];
        cloneplayer2Vs[3].player2.matchDate = matchSchedule[5];
        cloneplayer2Vs[4].player2.matchDate = matchSchedule[6];
        cloneplayer2Vs[5].player2.matchDate = matchSchedule[8];
        cloneplayer2Vs[6].player2.matchDate = matchSchedule[9];
        cloneplayer2Vs[7].player2.matchDate = matchSchedule[11];

        // LowerHalf
        let cloneplayer1Vs1 = [];
        for (let index = 0; index < 5; index++) {
          cloneplayer1Vs1.push(JSON.parse(JSON.stringify(player1Vs)));
        }
        cloneplayer1Vs1[0].player1.matchDate = matchSchedule[13];
        cloneplayer1Vs1[1].player1.matchDate = matchSchedule[15];
        cloneplayer1Vs1[2].player1.matchDate = matchSchedule[17];
        cloneplayer1Vs1[3].player1.matchDate = matchSchedule[19];
        cloneplayer1Vs1[4].player1.matchDate = matchSchedule[22];

        let cloneplayer2Vs1 = [];
        for (let index = 0; index < 6; index++) {
          cloneplayer2Vs1.push(JSON.parse(JSON.stringify(player2Vs)));
        }
        cloneplayer2Vs1[0].player2.matchDate = matchSchedule[12];
        cloneplayer2Vs1[1].player2.matchDate = matchSchedule[14];
        cloneplayer2Vs1[2].player2.matchDate = matchSchedule[16];
        cloneplayer2Vs1[3].player2.matchDate = matchSchedule[18];
        cloneplayer2Vs1[4].player2.matchDate = matchSchedule[20];
        cloneplayer2Vs1[5].player2.matchDate = matchSchedule[21];

        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              player2: { name: names[4], winner: true, ID: 5 },
            },
            {
              player1: { name: names[5], winner: true, ID: 6 },
              player2: { name: names[6], winner: true, ID: 7 },
            },
            {
              player1: { name: names[7] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[8], winner: true, ID: 9 },
              player2: { name: names[9], winner: true, ID: 10 },
            },
            {
              player1: { name: names[10], winner: true, ID: 11 },
              player2: { name: names[11], winner: true, ID: 12 },
            },
            {
              player1: { name: names[12], winner: true, ID: 13 },
              player2: { name: names[13], winner: true, ID: 14 },
            },
            {
              player1: { name: names[14] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[15], winner: true, ID: 16 },
              player2: { name: names[16], winner: true, ID: 17 },
            },
            {
              player1: { name: names[17], winner: true, ID: 18 },
              player2: { name: names[18], winner: true, ID: 19 },
            },
            {
              player1: { name: names[19], winner: true, ID: 20 },
              player2: { name: names[20], winner: true, ID: 21 },
            },
            {
              player1: { name: names[21] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[22], winner: true, ID: 23 },
              player2: { name: names[23], winner: true, ID: 24 },
            },
            {
              player1: { name: names[24], winner: true, ID: 25 },
              player2: { name: names[25], winner: true, ID: 26 },
            },
            {
              player1: { name: names[26], winner: true, ID: 27 },
              player2: { name: names[27], winner: true, ID: 28 },
            },
            {
              player1: { name: names[28] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[29], winner: true, ID: 30 },
              player2: { name: names[30], winner: true, ID: 31 },
            },
            {
              player1: { name: names[31], winner: true, ID: 32 },
              player2: { name: names[32], winner: true, ID: 33 },
            },
            {
              player1: { name: names[33], winner: true, ID: 34 },
              player2: { name: names[34], winner: true, ID: 35 },
            },
            {
              player1: { name: names[35], winner: true, ID: 36 },
              player2: { name: names[36], winner: true, ID: 37 },
            },
            {
              player1: { name: names[37], winner: true, ID: 38 },
              player2: { name: names[38], winner: true, ID: 39 },
            },
            {
              player1: { name: names[39], winner: true, ID: 40 },
              player2: { name: names[40], winner: true, ID: 41 },
            },
            {
              player1: { name: names[41] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[42] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[43], winner: true, ID: 44 },
              player2: { name: names[44], winner: true, ID: 45 },
            },
            {
              player1: { name: names[45], winner: true, ID: 46 },
              player2: { name: names[46], winner: true, ID: 47 },
            },
            {
              player1: { name: names[47], winner: true, ID: 48 },
              player2: { name: names[48], winner: true, ID: 49 },
            },
            {
              player1: { name: names[49] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[50], winner: true, ID: 51 },
              player2: { name: names[51], winner: true, ID: 52 },
            },
            {
              player1: { name: names[52], winner: true, ID: 53 },
              player2: { name: names[53], winner: true, ID: 54 },
            },
            {
              player1: { name: names[54] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            }
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs[0],
              ...cloneplayer2Vs[1]
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              ...cloneplayer2Vs[2]
            },
            {
              ...cloneplayer1Vs[1],
              ...cloneplayer2Vs[3]
            },
            {
              player1: { name: names[14], winner: true, ID: 15 },
              ...cloneplayer2Vs[4]
            },
            {
              ...cloneplayer1Vs[2],
              ...cloneplayer2Vs[5]
            },
            {
              player1: { name: names[21], winner: true, ID: 22 },
              ...cloneplayer2Vs[6]
            },
            {
              ...cloneplayer1Vs[3],
              ...cloneplayer2Vs[7]
            },
            {
              player1: { name: names[28], winner: true, ID: 29 },
              ...cloneplayer2Vs1[0]
            },
            {
              ...cloneplayer1Vs1[0],
              ...cloneplayer2Vs1[1]
            },
            {
              ...cloneplayer1Vs1[1],
              ...cloneplayer2Vs1[2]
            },
            {
              ...cloneplayer1Vs1[2],
              player2: { name: names[41], winner: true, ID: 42 },
            },
            {
              player1: { name: names[42], winner: true, ID: 43 },
              ...cloneplayer2Vs1[3],
            },
            {
              ...cloneplayer1Vs1[3],
              ...cloneplayer2Vs1[4]
            },
            {
              player1: { name: names[49], winner: true, ID: 50 },
              ...cloneplayer2Vs1[5]
            },
            {
              ...cloneplayer1Vs1[4],
              player2: { name: names[54], winner: true, ID: 55 },
            }
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 57) {
        let cloneroundsDummy = cloneRoundsDummyfn(25, 15);

        // UpperHalf
        let cloneplayer1Vs = [];
        for (let index = 0; index < 5; index++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
          if (index > 4)
            cloneplayer1Vs[index].player1.matchDate = matchSchedule[index * 3 + 1];
        }
        cloneplayer1Vs[0].player1.matchDate = matchSchedule[1];
        cloneplayer1Vs[1].player1.matchDate = matchSchedule[3];
        cloneplayer1Vs[2].player1.matchDate = matchSchedule[5];
        cloneplayer1Vs[3].player1.matchDate = matchSchedule[8];
        cloneplayer1Vs[4].player1.matchDate = matchSchedule[11];

        let cloneplayer2Vs = [];
        for (let index = 0; index < 8; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
        }
        cloneplayer2Vs[0].player2.matchDate = matchSchedule[0];
        cloneplayer2Vs[1].player2.matchDate = matchSchedule[2];
        cloneplayer2Vs[2].player2.matchDate = matchSchedule[4];
        cloneplayer2Vs[3].player2.matchDate = matchSchedule[6];
        cloneplayer2Vs[4].player2.matchDate = matchSchedule[7];
        cloneplayer2Vs[5].player2.matchDate = matchSchedule[9];
        cloneplayer2Vs[6].player2.matchDate = matchSchedule[10];
        cloneplayer2Vs[7].player2.matchDate = matchSchedule[12];

        // LowerHalf
        let cloneplayer1Vs1 = [];
        for (let index = 0; index < 4; index++) {
          cloneplayer1Vs1.push(JSON.parse(JSON.stringify(player1Vs)));
          cloneplayer1Vs1[index].player1.matchDate = matchSchedule[index * 3 + 14];
        }

        let cloneplayer2Vs1 = [];
        for (let index = 0; index < 8; index++) {
          cloneplayer2Vs1.push(JSON.parse(JSON.stringify(player2Vs)));
        }
        cloneplayer2Vs1[0].player2.matchDate = matchSchedule[13];
        cloneplayer2Vs1[1].player2.matchDate = matchSchedule[15];
        cloneplayer2Vs1[2].player2.matchDate = matchSchedule[16];
        cloneplayer2Vs1[3].player2.matchDate = matchSchedule[18];
        cloneplayer2Vs1[4].player2.matchDate = matchSchedule[19];
        cloneplayer2Vs1[5].player2.matchDate = matchSchedule[21];
        cloneplayer2Vs1[6].player2.matchDate = matchSchedule[22];
        cloneplayer2Vs1[7].player2.matchDate = matchSchedule[24];

        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              player2: { name: names[4], winner: true, ID: 5 },
            },
            {
              player1: { name: names[5], winner: true, ID: 6 },
              player2: { name: names[6], winner: true, ID: 7 },
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              player2: { name: names[8], winner: true, ID: 9 },
            },
            {
              player1: { name: names[9], winner: true, ID: 10 },
              player2: { name: names[10], winner: true, ID: 11 },
            },
            {
              player1: { name: names[11], winner: true, ID: 12 },
              player2: { name: names[12], winner: true, ID: 13 },
            },
            {
              player1: { name: names[13], winner: true, ID: 14 },
              player2: { name: names[14], winner: true, ID: 15 },
            },
            {
              player1: { name: names[15] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[16], winner: true, ID: 17 },
              player2: { name: names[17], winner: true, ID: 18 },
            },
            {
              player1: { name: names[18], winner: true, ID: 19 },
              player2: { name: names[19], winner: true, ID: 20 },
            },
            {
              player1: { name: names[20], winner: true, ID: 21 },
              player2: { name: names[21], winner: true, ID: 22 },
            },
            {
              player1: { name: names[22] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[23], winner: true, ID: 24 },
              player2: { name: names[24], winner: true, ID: 25 },
            },
            {
              player1: { name: names[25], winner: true, ID: 26 },
              player2: { name: names[26], winner: true, ID: 27 },
            },
            {
              player1: { name: names[27], winner: true, ID: 28 },
              player2: { name: names[28], winner: true, ID: 29 },
            },
            {
              player1: { name: names[29] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[30], winner: true, ID: 31 },
              player2: { name: names[31], winner: true, ID: 32 },
            },
            {
              player1: { name: names[32], winner: true, ID: 33 },
              player2: { name: names[33], winner: true, ID: 34 },
            },
            {
              player1: { name: names[34], winner: true, ID: 37 },
              player2: { name: names[35], winner: true, ID: 36 },
            },
            {
              player1: { name: names[36] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[37], winner: true, ID: 38 },
              player2: { name: names[38], winner: true, ID: 39 },
            },
            {
              player1: { name: names[39], winner: true, ID: 40 },
              player2: { name: names[40], winner: true, ID: 41 },
            },
            {
              player1: { name: names[41], winner: true, ID: 42 },
              player2: { name: names[42], winner: true, ID: 43 },
            },
            {
              player1: { name: names[43] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[44], winner: true, ID: 45 },
              player2: { name: names[45], winner: true, ID: 46 },
            },
            {
              player1: { name: names[46], winner: true, ID: 47 },
              player2: { name: names[47], winner: true, ID: 48 },
            },
            {
              player1: { name: names[48], winner: true, ID: 49 },
              player2: { name: names[49], winner: true, ID: 50 },
            },
            {
              player1: { name: names[50] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[51], winner: true, ID: 52 },
              player2: { name: names[52], winner: true, ID: 53 },
            },
            {
              player1: { name: names[53], winner: true, ID: 54 },
              player2: { name: names[54], winner: true, ID: 55 },
            },
            {
              player1: { name: names[55], winner: true, ID: 56 },
              player2: { name: names[56], winner: true, ID: 57 },
            }
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs[0],
            },
            {
              ...cloneplayer1Vs[0],
              ...cloneplayer2Vs[1]
            },
            {
              ...cloneplayer1Vs[1],
              ...cloneplayer2Vs[2]
            },
            {
              ...cloneplayer1Vs[2],
              ...cloneplayer2Vs[3]
            },
            {
              player1: { name: names[15], winner: true, ID: 16 },
              ...cloneplayer2Vs[4]
            },
            {
              ...cloneplayer1Vs[3],
              ...cloneplayer2Vs[5]
            },
            {
              player1: { name: names[22], winner: true, ID: 23 },
              ...cloneplayer2Vs[6]
            },
            {
              ...cloneplayer1Vs[4],
              ...cloneplayer2Vs[7]
            },
            {
              player1: { name: names[29], winner: true, ID: 30 },
              ...cloneplayer2Vs1[0]
            },
            {
              ...cloneplayer1Vs1[0],
              ...cloneplayer2Vs1[1]
            },
            {
              player1: { name: names[36], winner: true, ID: 37 },
              ...cloneplayer2Vs1[2]
            },
            {
              ...cloneplayer1Vs1[1],
              ...cloneplayer2Vs1[3]
            },
            {
              player1: { name: names[43], winner: true, ID: 44 },
              ...cloneplayer2Vs1[4]
            },
            {
              ...cloneplayer1Vs1[2],
              ...cloneplayer2Vs1[5]
            },
            {
              player1: { name: names[50], winner: true, ID: 51 },
              ...cloneplayer2Vs1[6]
            },
            {
              ...cloneplayer1Vs1[3],
              ...cloneplayer2Vs1[7]
            },
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 59) {
        let cloneroundsDummy = cloneRoundsDummyfn(27, 15);

        // UpperHalf
        let cloneplayer1Vs = [];
        for (let index = 0, indexY = -1; index < 8; index++, indexY++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
          if (index < 4) {
            cloneplayer1Vs[index].player1.matchDate = matchSchedule[++indexY];
          }
        }
        cloneplayer1Vs[4].player1.matchDate = matchSchedule[7];
        cloneplayer1Vs[5].player1.matchDate = matchSchedule[9];
        cloneplayer1Vs[6].player1.matchDate = matchSchedule[11];
        cloneplayer1Vs[7].player1.matchDate = matchSchedule[13];


        let cloneplayer2Vs = [];
        for (let index = 0, indexY = 0; index < 6; index++, indexY++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
          if (index < 3) {
            cloneplayer2Vs[index].player2.matchDate = matchSchedule[++indexY];
          }
        }
        cloneplayer2Vs[3].player2.matchDate = matchSchedule[8];
        cloneplayer2Vs[4].player2.matchDate = matchSchedule[10];
        cloneplayer2Vs[5].player2.matchDate = matchSchedule[12];

        // LowerHalf
        let cloneplayer1Vs1 = [];
        for (let index = 0; index < 5; index++) {
          cloneplayer1Vs1.push(JSON.parse(JSON.stringify(player1Vs)));
          if (index > 4)
            cloneplayer1Vs1[index].player1.matchDate = matchSchedule[index * 3 + 15];
        }
        cloneplayer1Vs1[0].player1.matchDate = matchSchedule[15];
        cloneplayer1Vs1[1].player1.matchDate = matchSchedule[17];
        cloneplayer1Vs1[2].player1.matchDate = matchSchedule[19];
        cloneplayer1Vs1[3].player1.matchDate = matchSchedule[22];
        cloneplayer1Vs1[4].player1.matchDate = matchSchedule[25];

        let cloneplayer2Vs1 = [];
        for (let index = 0; index < 8; index++) {
          cloneplayer2Vs1.push(JSON.parse(JSON.stringify(player2Vs)));
        }
        cloneplayer2Vs1[0].player2.matchDate = matchSchedule[14];
        cloneplayer2Vs1[1].player2.matchDate = matchSchedule[16];
        cloneplayer2Vs1[2].player2.matchDate = matchSchedule[18];
        cloneplayer2Vs1[3].player2.matchDate = matchSchedule[20];
        cloneplayer2Vs1[4].player2.matchDate = matchSchedule[21];
        cloneplayer2Vs1[5].player2.matchDate = matchSchedule[22];
        cloneplayer2Vs1[6].player2.matchDate = matchSchedule[24];
        cloneplayer2Vs1[7].player2.matchDate = matchSchedule[26];

        var rounds = [
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              player2: { name: names[1], winner: true, ID: 2 },
            },
            {
              player1: { name: names[2], winner: true, ID: 3 },
              player2: { name: names[3], winner: true, ID: 4 },
            },
            {
              player1: { name: names[4], winner: true, ID: 5 },
              player2: { name: names[5], winner: true, ID: 6 }
            },
            {
              player1: { name: names[6], winner: true, ID: 7 },
              player2: { name: names[7], winner: true, ID: 8 },
            },
            {
              player1: { name: names[8], winner: true, ID: 9 },
              player2: { name: names[9], winner: true, ID: 10 },
            },
            {
              player1: { name: names[10], winner: true, ID: 11 },
              player2: { name: names[11], winner: true, ID: 12 }
            },
            {
              player1: { name: names[12], winner: true, ID: 13 },
              player2: { name: names[13], winner: true, ID: 14 }
            },
            {
              player1: { name: names[14] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[15], winner: true, ID: 16 },
              player2: { name: names[16], winner: true, ID: 17 },
            },
            {
              player1: { name: names[17], winner: true, ID: 18 },
              player2: { name: names[18], winner: true, ID: 19 },
            },
            {
              player1: { name: names[19], winner: true, ID: 20 },
              player2: { name: names[20], winner: true, ID: 21 }
            },
            {
              player1: { name: names[21], winner: true, ID: 22 },
              player2: { name: names[22], winner: true, ID: 23 },
            },
            {
              player1: { name: names[23], winner: true, ID: 24 },
              player2: { name: names[24], winner: true, ID: 25 },
            },
            {
              player1: { name: names[25], winner: true, ID: 26 },
              player2: { name: names[26], winner: true, ID: 27 }
            },
            {
              player1: { name: names[27], winner: true, ID: 28 },
              player2: { name: names[28], winner: true, ID: 29 }
            },
            {
              player1: { name: names[29] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[30] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[31], winner: true, ID: 32 },
              player2: { name: names[32], winner: true, ID: 33 },
            },
            {
              player1: { name: names[33], winner: true, ID: 34 },
              player2: { name: names[34], winner: true, ID: 35 },
            },
            {
              player1: { name: names[35], winner: true, ID: 36 },
              player2: { name: names[36], winner: true, ID: 37 },
            },
            {
              player1: { name: names[37], winner: true, ID: 38 },
              player2: { name: names[38], winner: true, ID: 39 },
            },
            {
              player1: { name: names[39], winner: true, ID: 40 },
              player2: { name: names[40], winner: true, ID: 41 },
            },
            {
              player1: { name: names[41], winner: true, ID: 42 },
              player2: { name: names[42], winner: true, ID: 43 },
            },
            {
              player1: { name: names[43], winner: true, ID: 44 },
              player2: { name: names[44], winner: true, ID: 45 },
            },
            {
              player1: { name: names[45] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[46], winner: true, ID: 47 },
              player2: { name: names[47], winner: true, ID: 48 },
            },
            {
              player1: { name: names[48], winner: true, ID: 49 },
              player2: { name: names[49], winner: true, ID: 50 },
            },
            {
              player1: { name: names[50], winner: true, ID: 51 },
              player2: { name: names[51], winner: true, ID: 52 },
            },
            {
              player1: { name: names[52] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[53], winner: true, ID: 54 },
              player2: { name: names[54], winner: true, ID: 55 },
            },
            {
              player1: { name: names[55], winner: true, ID: 56 },
              player2: { name: names[56], winner: true, ID: 57 },
            },
            {
              player1: { name: names[57], winner: true, ID: 58 },
              player2: { name: names[58], winner: true, ID: 59 },
            },
          ],
          [
            {
              ...cloneplayer1Vs[0],
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs[1],
              ...cloneplayer2Vs[1]
            },
            {
              ...cloneplayer1Vs[2],
              ...cloneplayer2Vs[2]
            },
            {
              ...cloneplayer1Vs[3],
              player2: { name: names[14], winner: true, ID: 15 },
            },
            {
              ...cloneplayer1Vs[4],
              ...cloneplayer2Vs[3]
            },
            {
              ...cloneplayer1Vs[5],
              ...cloneplayer2Vs[4]
            },
            {
              ...cloneplayer1Vs[6],
              ...cloneplayer2Vs[5]
            },
            {
              ...cloneplayer1Vs[7],
              player2: { name: names[29], winner: true, ID: 30 },
            },
            {
              player1: { name: names[30], winner: true, ID: 31 },
              ...cloneplayer2Vs1[0],
            },
            {
              ...cloneplayer1Vs1[0],
              ...cloneplayer2Vs1[1]
            },
            {
              ...cloneplayer1Vs1[1],
              ...cloneplayer2Vs1[2]
            },
            {
              ...cloneplayer1Vs1[2],
              ...cloneplayer2Vs1[3]
            },
            {
              player1: { name: names[45], winner: true, ID: 46 },
              ...cloneplayer2Vs1[4]
            },
            {
              ...cloneplayer1Vs1[3],
              ...cloneplayer2Vs1[5]
            },
            {
              player1: { name: names[52], winner: true, ID: 53 },
              ...cloneplayer2Vs1[6]
            },
            {
              ...cloneplayer1Vs1[4],
              ...cloneplayer2Vs1[7]
            },
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 61) {
        let cloneroundsDummy = cloneRoundsDummyfn(29, 15);

        // UpperHalf
        let cloneplayer1Vs = [];
        for (let index = 0, indexY = -1; index < 8; index++, indexY++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
          cloneplayer1Vs[index].player1.matchDate = matchSchedule[++indexY];
        }

        let cloneplayer2Vs = [];
        for (let index = 0, indexY = 0; index < 7; index++, indexY++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
          cloneplayer2Vs[index].player2.matchDate = matchSchedule[++indexY];
        }

        // LowerHalf
        let cloneplayer1Vs1 = [];
        for (let index = 0, indexY = -1; index < 8; index++, indexY++) {
          cloneplayer1Vs1.push(JSON.parse(JSON.stringify(player1Vs)));
          if (index < 4) {
            cloneplayer1Vs1[index].player1.matchDate = matchSchedule[++indexY + 15];
          }
        }
        cloneplayer1Vs1[4].player1.matchDate = matchSchedule[22];
        cloneplayer1Vs1[5].player1.matchDate = matchSchedule[24];
        cloneplayer1Vs1[6].player1.matchDate = matchSchedule[26];
        cloneplayer1Vs1[7].player1.matchDate = matchSchedule[28];


        let cloneplayer2Vs1 = [];
        for (let index = 0, indexY = 0; index < 6; index++, indexY++) {
          cloneplayer2Vs1.push(JSON.parse(JSON.stringify(player2Vs)));
          if (index < 3) {
            cloneplayer2Vs1[index].player2.matchDate = matchSchedule[++indexY + 15];
          }
        }
        cloneplayer2Vs1[3].player2.matchDate = matchSchedule[23];
        cloneplayer2Vs1[4].player2.matchDate = matchSchedule[25];
        cloneplayer2Vs1[5].player2.matchDate = matchSchedule[27];

        var rounds = [
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              player2: { name: names[1], winner: true, ID: 2 },
            },
            {
              player1: { name: names[2], winner: true, ID: 3 },
              player2: { name: names[3], winner: true, ID: 4 },
            },
            {
              player1: { name: names[4], winner: true, ID: 5 },
              player2: { name: names[5], winner: true, ID: 6 }
            },
            {
              player1: { name: names[6], winner: true, ID: 7 },
              player2: { name: names[7], winner: true, ID: 8 },
            },
            {
              player1: { name: names[8], winner: true, ID: 9 },
              player2: { name: names[9], winner: true, ID: 10 },
            },
            {
              player1: { name: names[10], winner: true, ID: 11 },
              player2: { name: names[11], winner: true, ID: 12 },
            },
            {
              player1: { name: names[12], winner: true, ID: 13 },
              player2: { name: names[13], winner: true, ID: 14 }
            },
            {
              player1: { name: names[14], winner: true, ID: 15 },
              player2: { name: names[15], winner: true, ID: 16 },
            },
            {
              player1: { name: names[16], winner: true, ID: 17 },
              player2: { name: names[17], winner: true, ID: 18 },
            },
            {
              player1: { name: names[18], winner: true, ID: 19 },
              player2: { name: names[19], winner: true, ID: 20 },
            },
            {
              player1: { name: names[20], winner: true, ID: 21 },
              player2: { name: names[21], winner: true, ID: 22 }
            },
            {
              player1: { name: names[22], winner: true, ID: 23 },
              player2: { name: names[23], winner: true, ID: 24 },
            },
            {
              player1: { name: names[24], winner: true, ID: 25 },
              player2: { name: names[25], winner: true, ID: 26 },
            },
            {
              player1: { name: names[26], winner: true, ID: 27 },
              player2: { name: names[27], winner: true, ID: 28 }
            },
            {
              player1: { name: names[28], winner: true, ID: 29 },
              player2: { name: names[29], winner: true, ID: 30 }
            },
            {
              player1: { name: names[30] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[31], winner: true, ID: 32 },
              player2: { name: names[32], winner: true, ID: 33 },
            },
            {
              player1: { name: names[33], winner: true, ID: 34 },
              player2: { name: names[34], winner: true, ID: 35 },
            },
            {
              player1: { name: names[35], winner: true, ID: 36 },
              player2: { name: names[36], winner: true, ID: 37 }
            },
            {
              player1: { name: names[37], winner: true, ID: 38 },
              player2: { name: names[38], winner: true, ID: 39 },
            },
            {
              player1: { name: names[39], winner: true, ID: 40 },
              player2: { name: names[40], winner: true, ID: 41 },
            },
            {
              player1: { name: names[41], winner: true, ID: 42 },
              player2: { name: names[42], winner: true, ID: 43 }
            },
            {
              player1: { name: names[43], winner: true, ID: 44 },
              player2: { name: names[44], winner: true, ID: 45 }
            },
            {
              player1: { name: names[45] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[46], winner: true, ID: 47 },
              player2: { name: names[47], winner: true, ID: 48 },
            },
            {
              player1: { name: names[48], winner: true, ID: 49 },
              player2: { name: names[49], winner: true, ID: 50 },
            },
            {
              player1: { name: names[50], winner: true, ID: 51 },
              player2: { name: names[51], winner: true, ID: 52 }
            },
            {
              player1: { name: names[52], winner: true, ID: 53 },
              player2: { name: names[53], winner: true, ID: 54 },
            },
            {
              player1: { name: names[54], winner: true, ID: 55 },
              player2: { name: names[55], winner: true, ID: 56 },
            },
            {
              player1: { name: names[56], winner: true, ID: 57 },
              player2: { name: names[57], winner: true, ID: 58 }
            },
            {
              player1: { name: names[58], winner: true, ID: 59 },
              player2: { name: names[59], winner: true, ID: 60 }
            },
            {
              player1: { name: names[60] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
          ],
          [
            {
              ...cloneplayer1Vs[0],
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs[1],
              ...cloneplayer2Vs[1]
            },
            {
              ...cloneplayer1Vs[2],
              ...cloneplayer2Vs[2]
            },
            {
              ...cloneplayer1Vs[3],
              ...cloneplayer2Vs[3]
            },
            {
              ...cloneplayer1Vs[4],
              ...cloneplayer2Vs[4]
            },
            {
              ...cloneplayer1Vs[5],
              ...cloneplayer2Vs[5]
            },
            {
              ...cloneplayer1Vs[6],
              ...cloneplayer2Vs[6]
            },
            {
              ...cloneplayer1Vs[7],
              player2: { name: names[30], winner: true, ID: 31 },
            },
            {
              ...cloneplayer1Vs1[0],
              ...cloneplayer2Vs1[0]
            },
            {
              ...cloneplayer1Vs1[1],
              ...cloneplayer2Vs1[1]
            },
            {
              ...cloneplayer1Vs1[2],
              ...cloneplayer2Vs1[2]
            },
            {
              ...cloneplayer1Vs1[3],
              player2: { name: names[45], winner: true, ID: 46 },
            },
            {
              ...cloneplayer1Vs1[4],
              ...cloneplayer2Vs1[3]
            },
            {
              ...cloneplayer1Vs1[5],
              ...cloneplayer2Vs1[4]
            },
            {
              ...cloneplayer1Vs1[6],
              ...cloneplayer2Vs1[5]
            },
            {
              ...cloneplayer1Vs1[7],
              player2: { name: names[60], winner: true, ID: 61 },
            }
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 63) {
        let cloneroundsDummy = cloneRoundsDummyfn(31, 15);
        let rounds = [];

        //LowerHalf
        let cloneplayer1Vs = [];
        for (let index = 0, indexY = -1; index < 8; index++, indexY++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
          cloneplayer1Vs[index].player1.matchDate = matchSchedule[++indexY + 16];
        }

        let cloneplayer2Vs = [];
        for (let index = 0, indexY = 0; index < 7; index++, indexY++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
          cloneplayer2Vs[index].player2.matchDate = matchSchedule[++indexY + 16];
        }

        // UpperHalf
        let clonePlayerVsInit = round2ClonePlayersInitfn((teamSize / 2) / 2);
        var round1 = teamBracketRound1(16);
        var round2 = round2ClonePlayersVsfn(clonePlayerVsInit, (teamSize / 2) / 2 / 2);
        rounds.push(
          [...round1[0],
          {
            player1: { name: names[32], winner: true, ID: 33 },
            player2: { name: names[33], winner: true, ID: 34 },
          },
          {
            player1: { name: names[34], winner: true, ID: 35 },
            player2: { name: names[35], winner: true, ID: 36 },
          },
          {
            player1: { name: names[36], winner: true, ID: 37 },
            player2: { name: names[37], winner: true, ID: 38 }
          },
          {
            player1: { name: names[38], winner: true, ID: 39 },
            player2: { name: names[39], winner: true, ID: 40 },
          },
          {
            player1: { name: names[40], winner: true, ID: 41 },
            player2: { name: names[41], winner: true, ID: 42 },
          },
          {
            player1: { name: names[42], winner: true, ID: 43 },
            player2: { name: names[43], winner: true, ID: 44 },
          },
          {
            player1: { name: names[44], winner: true, ID: 45 },
            player2: { name: names[45], winner: true, ID: 46 }
          },
          {
            player1: { name: names[46], winner: true, ID: 47 },
            player2: { name: names[47], winner: true, ID: 48 },
          },
          {
            player1: { name: names[48], winner: true, ID: 49 },
            player2: { name: names[49], winner: true, ID: 50 },
          },
          {
            player1: { name: names[50], winner: true, ID: 51 },
            player2: { name: names[51], winner: true, ID: 52 },
          },
          {
            player1: { name: names[52], winner: true, ID: 53 },
            player2: { name: names[53], winner: true, ID: 54 }
          },
          {
            player1: { name: names[54], winner: true, ID: 55 },
            player2: { name: names[55], winner: true, ID: 56 },
          },
          {
            player1: { name: names[56], winner: true, ID: 57 },
            player2: { name: names[57], winner: true, ID: 58 },
          },
          {
            player1: { name: names[58], winner: true, ID: 59 },
            player2: { name: names[59], winner: true, ID: 60 }
          },
          {
            player1: { name: names[60], winner: true, ID: 61 },
            player2: { name: names[61], winner: true, ID: 62 }
          },
          {
            player1: { name: names[62] + `(Bye)`, winner: true, ID: 101 },
            ...round1ByePlr2
          },
          ])
        rounds.push(
          [...round2,
          {
            ...cloneplayer1Vs[0],
            ...cloneplayer2Vs[0]
          },
          {
            ...cloneplayer1Vs[1],
            ...cloneplayer2Vs[1]
          },
          {
            ...cloneplayer1Vs[2],
            ...cloneplayer2Vs[2]
          },
          {
            ...cloneplayer1Vs[3],
            ...cloneplayer2Vs[3]
          },
          {
            ...cloneplayer1Vs[4],
            ...cloneplayer2Vs[4]
          },
          {
            ...cloneplayer1Vs[5],
            ...cloneplayer2Vs[5]
          },
          {
            ...cloneplayer1Vs[6],
            ...cloneplayer2Vs[6]
          },
          {
            ...cloneplayer1Vs[7],
            player2: { name: names[62], winner: true, ID: 63 },
          }
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        );
        console.log(rounds)
        return rounds;
      }
    }

    else {
      if (teamSize == 6) {
        var cloneroundsDummy = cloneRoundsDummyfn(2, 1);
        let rounds = [[], []];
        let number1 = 0, number2 = 0;
        while (number1 < 2) { //-- 2 for running team size 3 twice.
          // let round1 = team3Round1(number2, teamSize / 2);
          rounds[0].push(...team3Round1(number2, teamSize / 2));
          // let round2 = team3Round2(number2, number1);
          rounds[1].push(...team3Round2(number2, number1));
          number2 += 3;
          ++number1;
        }
        rounds.push([cloneroundsDummy[0]], [roundsFinalDummy]);
        return rounds;
      }
      else if (teamSize == 10) {
        let cloneroundsDummy = cloneRoundsDummyfn(2, 3);
        let rounds = [[], []];
        let number1 = 0, number2 = 0;
        while (number1 < 2) {
          rounds[0].push(...team5Round1(number2));
          rounds[1].push(...team5Round2(number2, number1));
          number2 += 5;
          ++number1;
        }
        rounds.push(
          [cloneroundsDummy[0], cloneroundsDummy[1]],
          [cloneroundsDummy[2]],
          [roundsFinalDummy]
        );
        return rounds;
      }
      else if (teamSize == 12) {
        let cloneroundsDummy = cloneRoundsDummyfn(4, 3);
        let rounds = [[], []];
        let number1 = 0, number2 = 0;
        while (number1 < 4) {
          let round1 = team3Round1(number2, teamSize / 2);
          rounds[0].push(...round1);
          let round2 = team3Round2(number2, number1);
          rounds[1].push(...round2);
          number2 += 3;
          ++number1;
        }
        rounds.push(
          [cloneroundsDummy[0], cloneroundsDummy[1]],
          [cloneroundsDummy[2]],
          [roundsFinalDummy]
        );
        return rounds;
      }
      else if (teamSize == 14) {
        let cloneroundsDummy = cloneRoundsDummyfn(6, 3);

        let cloneplayer2Vs = [];
        for (let index = 0; index < 4; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
        }
        cloneplayer2Vs[0].player2.matchDate = matchSchedule[0];
        cloneplayer2Vs[1].player2.matchDate = matchSchedule[2];
        cloneplayer2Vs[2].player2.matchDate = matchSchedule[3];
        cloneplayer2Vs[3].player2.matchDate = matchSchedule[5];

        let cloneplayer1Vs = [];
        for (let index = 0; index < 2; index++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
        }
        cloneplayer1Vs[0].player1.matchDate = matchSchedule[1];
        cloneplayer1Vs[1].player1.matchDate = matchSchedule[4];

        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              player2: { name: names[4], winner: true, ID: 5 },
            },
            {
              player1: { name: names[5], winner: true, ID: 6 },
              player2: { name: names[6], winner: true, ID: 7 },
            },
            {
              player1: { name: names[7] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[8], winner: true, ID: 9 },
              player2: { name: names[9], winner: true, ID: 10 },
            },
            {
              player1: { name: names[10], winner: true, ID: 11 },
              player2: { name: names[11], winner: true, ID: 12 },
            },
            {
              player1: { name: names[12], winner: true, ID: 13 },
              player2: { name: names[13], winner: true, ID: 14 },
            },
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs[0],
              ...cloneplayer2Vs[1]
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              ...cloneplayer2Vs[2]
            },
            {
              ...cloneplayer1Vs[1],
              ...cloneplayer2Vs[3]
            },
          ],
          [cloneroundsDummy[0], cloneroundsDummy[1]],
          [cloneroundsDummy[2]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 18) {
        let cloneroundsDummy = cloneRoundsDummyfn(2, 7);

        let cloneplayer2Vs = [];
        for (let index = 0; index < 2; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
          cloneplayer2Vs[index].player2.matchDate = matchSchedule[index];
        }

        let player1Loop = [[], []];
        for (let index1 = 3, index2 = 12; index1 < 10 && index2 < 18; index1++, index2++) {
          player1Loop[0].push({
            player1: { name: names[index1] + `(Bye)`, winner: true, ID: 101 },
            ...round1ByePlr2
          });
          player1Loop[1].push({
            player1: { name: names[index2] + `(Bye)`, winner: true, ID: 101 },
            ...round1ByePlr2
          });
        }

        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            ...player1Loop[0],
            {
              player1: { name: names[9] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[10], winner: true, ID: 11 },
              player2: { name: names[11], winner: true, ID: 12 },
            },
            ...player1Loop[1]
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs[0],
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              player2: { name: names[4], winner: true, ID: 5 },
            },
            {
              player1: { name: names[5], winner: true, ID: 6 },
              player2: { name: names[6], winner: true, ID: 7 },
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              player2: { name: names[8], winner: true, ID: 9 },
            },
            {
              player1: { name: names[9], winner: true, ID: 10 },
              ...cloneplayer2Vs[1],
            },
            {
              player1: { name: names[12], winner: true, ID: 13 },
              player2: { name: names[13], winner: true, ID: 14 },
            },
            {
              player1: { name: names[14], winner: true, ID: 15 },
              player2: { name: names[15], winner: true, ID: 16 },
            },
            {
              player1: { name: names[16], winner: true, ID: 17 },
              player2: { name: names[17], winner: true, ID: 18 },
            }
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3]
          ],
          [cloneroundsDummy[4], cloneroundsDummy[5]],
          [cloneroundsDummy[6]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 20) {
        let cloneroundsDummy = cloneRoundsDummyfn(4, 7);
        let rounds = [[], []];
        let number1 = 0, number2 = 0;
        while (number1 < 4) {
          rounds[0].push(...team5Round1(number2));
          rounds[1].push(...team5Round2(number2, number1));
          number2 += 5;
          ++number1;
        }
        rounds.push([
          cloneroundsDummy[0],
          cloneroundsDummy[1],
          cloneroundsDummy[2],
          cloneroundsDummy[3]
        ],
          [cloneroundsDummy[4], cloneroundsDummy[5]],
          [cloneroundsDummy[6]],
          [roundsFinalDummy]
        );
        return rounds;
      }
      else if (teamSize == 22) {
        let cloneroundsDummy = cloneRoundsDummyfn(6, 7);

        let cloneplayer2Vs = [];
        for (let index = 0; index < 4; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
        }
        cloneplayer2Vs[0].player2.matchDate = matchSchedule[0];
        cloneplayer2Vs[1].player2.matchDate = matchSchedule[2];
        cloneplayer2Vs[2].player2.matchDate = matchSchedule[3];
        cloneplayer2Vs[3].player2.matchDate = matchSchedule[5];

        let cloneplayer1Vs = [];
        for (let index = 0; index < 2; index++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
        }
        cloneplayer1Vs[0].player1.matchDate = matchSchedule[1];
        cloneplayer1Vs[1].player1.matchDate = matchSchedule[4];

        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              player2: { name: names[4], winner: true, ID: 5 },
            },
            {
              player1: { name: names[5] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[6] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              player2: { name: names[8], winner: true, ID: 9 }
            },
            {
              player1: { name: names[9] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[10] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[11] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[12], winner: true, ID: 13 },
              player2: { name: names[13], winner: true, ID: 14 },
            },
            {
              player1: { name: names[14], winner: true, ID: 15 },
              player2: { name: names[15], winner: true, ID: 16 },
            },
            {
              player1: { name: names[16] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[17] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[18], winner: true, ID: 19 },
              player2: { name: names[19], winner: true, ID: 20 }
            },
            {
              player1: { name: names[20] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[21] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs[0],
              player2: { name: names[5], winner: true, ID: 6 },
            },
            {
              player1: { name: names[6], winner: true, ID: 7 },
              ...cloneplayer2Vs[1]
            },
            {
              player1: { name: names[9], winner: true, ID: 10 },
              player2: { name: names[10], winner: true, ID: 11 }
            },
            {
              player1: { name: names[11], winner: true, ID: 12 },
              ...cloneplayer2Vs[2]
            },
            {
              ...cloneplayer1Vs[1],
              player2: { name: names[16], winner: true, ID: 17 },
            },
            {
              player1: { name: names[17], winner: true, ID: 18 },
              ...cloneplayer2Vs[3]
            },
            {
              player1: { name: names[20], winner: true, ID: 21 },
              player2: { name: names[21], winner: true, ID: 22 }
            },
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3]
          ],
          [cloneroundsDummy[4], cloneroundsDummy[5]],
          [cloneroundsDummy[6]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 24) {
        let cloneroundsDummy = cloneRoundsDummyfn(8, 7);
        let rounds = [[], []];
        let number1 = 0, number2 = 0;
        while (number1 < 8) {
          let round1 = team3Round1(number2, teamSize / 2);
          rounds[0].push(...round1);
          let round2 = team3Round2(number2, number1);
          rounds[1].push(...round2);
          number2 += 3;
          ++number1;
        }
        rounds.push(
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3]
          ],
          [cloneroundsDummy[4], cloneroundsDummy[5]],
          [cloneroundsDummy[6]],
          [roundsFinalDummy]
        );
        return rounds;
      }
      else if (teamSize == 26) {
        let cloneroundsDummy = cloneRoundsDummyfn(10, 7);

        let cloneplayer2Vs = [];
        for (let index = 0; index < 4; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
        }
        cloneplayer2Vs[0].player2.matchDate = matchSchedule[1];
        cloneplayer2Vs[1].player2.matchDate = matchSchedule[3];
        cloneplayer2Vs[2].player2.matchDate = matchSchedule[6];
        cloneplayer2Vs[3].player2.matchDate = matchSchedule[8];

        let cloneplayer1Vs = [];
        for (let index = 0; index < 6; index++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
        }
        cloneplayer1Vs[0].player1.matchDate = matchSchedule[0];
        cloneplayer1Vs[1].player1.matchDate = matchSchedule[2];
        cloneplayer1Vs[2].player1.matchDate = matchSchedule[4];
        cloneplayer1Vs[3].player1.matchDate = matchSchedule[5];
        cloneplayer1Vs[4].player1.matchDate = matchSchedule[7];
        cloneplayer1Vs[5].player1.matchDate = matchSchedule[9];

        var rounds = [
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              player2: { name: names[1], winner: true, ID: 2 },
            },
            {
              player1: { name: names[2], winner: true, ID: 3 },
              player2: { name: names[3], winner: true, ID: 4 }
            },
            {
              player1: { name: names[4], winner: true, ID: 5 },
              player2: { name: names[5], winner: true, ID: 6 }
            },
            {
              player1: { name: names[6] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[7] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[8], winner: true, ID: 9 },
              player2: { name: names[9], winner: true, ID: 10 },
            },
            {
              player1: { name: names[10], winner: true, ID: 11 },
              player2: { name: names[11], winner: true, ID: 12 },
            },
            {
              player1: { name: names[12] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[13], winner: true, ID: 14 },
              player2: { name: names[14], winner: true, ID: 15 },
            },
            {
              player1: { name: names[15], winner: true, ID: 16 },
              player2: { name: names[16], winner: true, ID: 17 }
            },
            {
              player1: { name: names[17], winner: true, ID: 18 },
              player2: { name: names[18], winner: true, ID: 19 }
            },
            {
              player1: { name: names[19] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[20] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[21], winner: true, ID: 22 },
              player2: { name: names[22], winner: true, ID: 23 },
            },
            {
              player1: { name: names[23], winner: true, ID: 24 },
              player2: { name: names[24], winner: true, ID: 25 },
            },
            {
              player1: { name: names[25] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            }
          ],
          [
            {
              ...cloneplayer1Vs[0],
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs[1],
              player2: { name: names[6], winner: true, ID: 7 },
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              ...cloneplayer2Vs[1]
            },
            {
              ...cloneplayer1Vs[2],
              player2: { name: names[12], winner: true, ID: 13 },
            },
            {
              ...cloneplayer1Vs[3],
              ...cloneplayer2Vs[2]
            },
            {
              ...cloneplayer1Vs[4],
              player2: { name: names[19], winner: true, ID: 20 },
            },
            {
              player1: { name: names[20], winner: true, ID: 21 },
              ...cloneplayer2Vs[3]
            },
            {
              ...cloneplayer1Vs[5],
              player2: { name: names[25], winner: true, ID: 26 },
            }
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3]
          ],
          [cloneroundsDummy[4], cloneroundsDummy[5]],
          [cloneroundsDummy[6]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 28) {
        let cloneroundsDummy = cloneRoundsDummyfn(12, 7);

        let cloneplayer1Vs = [];
        for (let index = 0; index < 4; index++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
          cloneplayer1Vs[index].player1.matchDate = matchSchedule[index * 3 + 1];
        }

        let cloneplayer2Vs = [];
        for (let index = 0; index < 8; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
        }
        cloneplayer2Vs[0].player2.matchDate = matchSchedule[0];
        cloneplayer2Vs[1].player2.matchDate = matchSchedule[2];
        cloneplayer2Vs[2].player2.matchDate = matchSchedule[3];
        cloneplayer2Vs[3].player2.matchDate = matchSchedule[5];
        cloneplayer2Vs[4].player2.matchDate = matchSchedule[6];
        cloneplayer2Vs[5].player2.matchDate = matchSchedule[8];
        cloneplayer2Vs[6].player2.matchDate = matchSchedule[9];
        cloneplayer2Vs[7].player2.matchDate = matchSchedule[11];

        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              player2: { name: names[4], winner: true, ID: 5 },
            },
            {
              player1: { name: names[5], winner: true, ID: 6 },
              player2: { name: names[6], winner: true, ID: 7 },
            },
            {
              player1: { name: names[7] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[8], winner: true, ID: 9 },
              player2: { name: names[9], winner: true, ID: 10 },
            },
            {
              player1: { name: names[10], winner: true, ID: 11 },
              player2: { name: names[11], winner: true, ID: 12 },
            },
            {
              player1: { name: names[12], winner: true, ID: 13 },
              player2: { name: names[13], winner: true, ID: 14 },
            },
            {
              player1: { name: names[14] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[15], winner: true, ID: 16 },
              player2: { name: names[16], winner: true, ID: 17 },
            },
            {
              player1: { name: names[17], winner: true, ID: 18 },
              player2: { name: names[18], winner: true, ID: 19 },
            },
            {
              player1: { name: names[19], winner: true, ID: 20 },
              player2: { name: names[20], winner: true, ID: 21 },
            },
            {
              player1: { name: names[21] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[22], winner: true, ID: 23 },
              player2: { name: names[23], winner: true, ID: 24 },
            },
            {
              player1: { name: names[24], winner: true, ID: 25 },
              player2: { name: names[25], winner: true, ID: 26 },
            },
            {
              player1: { name: names[26], winner: true, ID: 27 },
              player2: { name: names[27], winner: true, ID: 28 },
            }
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs[0],
              ...cloneplayer2Vs[1]
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              ...cloneplayer2Vs[2]
            },
            {
              ...cloneplayer1Vs[1],
              ...cloneplayer2Vs[3]
            },
            {
              player1: { name: names[14], winner: true, ID: 15 },
              ...cloneplayer2Vs[4]
            },
            {
              ...cloneplayer1Vs[2],
              ...cloneplayer2Vs[5]
            },
            {
              player1: { name: names[21], winner: true, ID: 22 },
              ...cloneplayer2Vs[6]
            },
            {
              ...cloneplayer1Vs[3],
              ...cloneplayer2Vs[7]
            },
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3]
          ],
          [cloneroundsDummy[4], cloneroundsDummy[5]],
          [cloneroundsDummy[6]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 30) {
        let cloneroundsDummy = cloneRoundsDummyfn(14, 7);

        let cloneplayer1Vs = [];
        for (let index = 0, indexY = -1; index < 8; index++, indexY++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
          if (index < 4) {
            cloneplayer1Vs[index].player1.matchDate = matchSchedule[++indexY];
          }
        }
        cloneplayer1Vs[4].player1.matchDate = matchSchedule[7];
        cloneplayer1Vs[5].player1.matchDate = matchSchedule[9];
        cloneplayer1Vs[6].player1.matchDate = matchSchedule[11];
        cloneplayer1Vs[7].player1.matchDate = matchSchedule[13];


        let cloneplayer2Vs = [];
        for (let index = 0, indexY = 0; index < 6; index++, indexY++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
          if (index < 3) {
            cloneplayer2Vs[index].player2.matchDate = matchSchedule[++indexY];
          }
        }
        cloneplayer2Vs[3].player2.matchDate = matchSchedule[8];
        cloneplayer2Vs[4].player2.matchDate = matchSchedule[10];
        cloneplayer2Vs[5].player2.matchDate = matchSchedule[12];

        var rounds = [
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              player2: { name: names[1], winner: true, ID: 2 },
            },
            {
              player1: { name: names[2], winner: true, ID: 3 },
              player2: { name: names[3], winner: true, ID: 4 },
            },
            {
              player1: { name: names[4], winner: true, ID: 5 },
              player2: { name: names[5], winner: true, ID: 6 }
            },
            {
              player1: { name: names[6], winner: true, ID: 7 },
              player2: { name: names[7], winner: true, ID: 8 },
            },
            {
              player1: { name: names[8], winner: true, ID: 9 },
              player2: { name: names[9], winner: true, ID: 10 },
            },
            {
              player1: { name: names[10], winner: true, ID: 11 },
              player2: { name: names[11], winner: true, ID: 12 }
            },
            {
              player1: { name: names[12], winner: true, ID: 13 },
              player2: { name: names[13], winner: true, ID: 14 }
            },
            {
              player1: { name: names[14] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[15], winner: true, ID: 16 },
              player2: { name: names[16], winner: true, ID: 17 },
            },
            {
              player1: { name: names[17], winner: true, ID: 18 },
              player2: { name: names[18], winner: true, ID: 19 },
            },
            {
              player1: { name: names[19], winner: true, ID: 20 },
              player2: { name: names[20], winner: true, ID: 21 }
            },
            {
              player1: { name: names[21], winner: true, ID: 22 },
              player2: { name: names[22], winner: true, ID: 23 },
            },
            {
              player1: { name: names[23], winner: true, ID: 24 },
              player2: { name: names[24], winner: true, ID: 25 },
            },
            {
              player1: { name: names[25], winner: true, ID: 26 },
              player2: { name: names[26], winner: true, ID: 27 }
            },
            {
              player1: { name: names[27], winner: true, ID: 28 },
              player2: { name: names[28], winner: true, ID: 29 }
            },
            {
              player1: { name: names[29] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
          ],
          [
            {
              ...cloneplayer1Vs[0],
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs[1],
              ...cloneplayer2Vs[1]
            },
            {
              ...cloneplayer1Vs[2],
              ...cloneplayer2Vs[2]
            },
            {
              ...cloneplayer1Vs[3],
              player2: { name: names[14], winner: true, ID: 15 },
            },
            {
              ...cloneplayer1Vs[4],
              ...cloneplayer2Vs[3]
            },
            {
              ...cloneplayer1Vs[5],
              ...cloneplayer2Vs[4]
            },
            {
              ...cloneplayer1Vs[6],
              ...cloneplayer2Vs[5]
            },
            {
              ...cloneplayer1Vs[7],
              player2: { name: names[29], winner: true, ID: 30 },
            }
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3]
          ],
          [cloneroundsDummy[4], cloneroundsDummy[5]],
          [cloneroundsDummy[6]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 34) {
        let cloneroundsDummy = cloneRoundsDummyfn(3, 15);

        var cloneplayer2Vs = JSON.parse(JSON.stringify(player2Vs));
        cloneplayer2Vs.player2.matchDate = matchSchedule[0];
        var cloneplayer2Vs2 = JSON.parse(JSON.stringify(player2Vs));
        cloneplayer2Vs2.player2.matchDate = matchSchedule[1];

        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            {
              player1: { name: names[3] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[4] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[5] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[6] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[7] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[8] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[9] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[10] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[11] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[12] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[13] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[14] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[15] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[16] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[17] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[18], winner: true, ID: 19 },
              player2: { name: names[19], winner: true, ID: 20 },
            },
            {
              player1: { name: names[20] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[21] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[22] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[23] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[24] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[25] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[26] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[27] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[28] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[29] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[30] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[31] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[32] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[33] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs,
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              player2: { name: names[4], winner: true, ID: 5 },
            },
            {
              player1: { name: names[5], winner: true, ID: 6 },
              player2: { name: names[6], winner: true, ID: 7 },
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              player2: { name: names[8], winner: true, ID: 9 },
            },
            {
              player1: { name: names[9], winner: true, ID: 10 },
              player2: { name: names[10], winner: true, ID: 11 },
            },
            {
              player1: { name: names[11], winner: true, ID: 12 },
              player2: { name: names[12], winner: true, ID: 13 },
            },
            {
              player1: { name: names[13], winner: true, ID: 14 },
              player2: { name: names[14], winner: true, ID: 15 },
            },
            {
              player1: { name: names[15], winner: true, ID: 16 },
              player2: { name: names[16], winner: true, ID: 17 },
            },
            {
              player1: { name: names[17], winner: true, ID: 18 },
              ...cloneplayer2Vs2,
            },
            {
              player1: { name: names[20], winner: true, ID: 21 },
              player2: { name: names[21], winner: true, ID: 22 },
            },
            {
              player1: { name: names[22], winner: true, ID: 23 },
              player2: { name: names[23], winner: true, ID: 24 },
            },
            {
              player1: { name: names[24], winner: true, ID: 25 },
              player2: { name: names[25], winner: true, ID: 26 },
            },
            {
              player1: { name: names[26], winner: true, ID: 27 },
              player2: { name: names[27], winner: true, ID: 28 },
            },
            {
              player1: { name: names[28], winner: true, ID: 29 },
              player2: { name: names[29], winner: true, ID: 30 },
            },
            {
              player1: { name: names[30], winner: true, ID: 31 },
              player2: { name: names[31], winner: true, ID: 32 },
            },
            {
              player1: { name: names[32], winner: true, ID: 33 },
              player2: { name: names[33], winner: true, ID: 34 },
            },
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 36) {
        let cloneroundsDummy = cloneRoundsDummyfn(4, 15);

        let cloneplayer2Vs = [];
        for (let index = 0; index < 4; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
          cloneplayer2Vs[index].player2.matchDate = matchSchedule[index];
        }

        let player1Loop = [[], [], [], []];
        for (let index1 = 3, index2 = 12, index3 = 21, index4 = 30; index1 < 10 && index2 < 18; index1++, index2++, index3++, index4++) {
          player1Loop[0].push({
            player1: { name: names[index1] + `(Bye)`, ID: 101 },
            ...round1ByePlr2
          });
          player1Loop[1].push({
            player1: { name: names[index2] + `(Bye)`, ID: 101 },
            ...round1ByePlr2
          });
          player1Loop[2].push({
            player1: { name: names[index3] + `(Bye)`, ID: 101 },
            ...round1ByePlr2
          });
          player1Loop[3].push({
            player1: { name: names[index4] + `(Bye)`, ID: 101 },
            ...round1ByePlr2
          });
        }

        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            ...player1Loop[0],
            {
              player1: { name: names[9] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[10], winner: true, ID: 11 },
              player2: { name: names[11], winner: true, ID: 12 },
            },
            ...player1Loop[1],
            {
              player1: { name: names[18] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[19], winner: true, ID: 2 },
              player2: { name: names[20], winner: true, ID: 3 },
            },
            ...player1Loop[2],
            {
              player1: { name: names[27] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[28], winner: true, ID: 11 },
              player2: { name: names[29], winner: true, ID: 12 },
            },
            ...player1Loop[3]
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs[0],
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              player2: { name: names[4], winner: true, ID: 5 },
            },
            {
              player1: { name: names[5], winner: true, ID: 6 },
              player2: { name: names[6], winner: true, ID: 7 },
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              player2: { name: names[8], winner: true, ID: 9 },
            },
            {
              player1: { name: names[9], winner: true, ID: 10 },
              ...cloneplayer2Vs[1],
            },
            {
              player1: { name: names[12], winner: true, ID: 13 },
              player2: { name: names[13], winner: true, ID: 14 },
            },
            {
              player1: { name: names[14], winner: true, ID: 15 },
              player2: { name: names[15], winner: true, ID: 16 },
            },
            {
              player1: { name: names[16], winner: true, ID: 17 },
              player2: { name: names[17], winner: true, ID: 18 },
            },
            {
              player1: { name: names[18], winner: true, ID: 19 },
              ...cloneplayer2Vs[2],
            },
            {
              player1: { name: names[21], winner: true, ID: 22 },
              player2: { name: names[22], winner: true, ID: 23 },
            },
            {
              player1: { name: names[23], winner: true, ID: 24 },
              player2: { name: names[24], winner: true, ID: 25 },
            },
            {
              player1: { name: names[25], winner: true, ID: 26 },
              player2: { name: names[26], winner: true, ID: 27 },
            },
            {
              player1: { name: names[27], winner: true, ID: 28 },
              ...cloneplayer2Vs[3],
            },
            {
              player1: { name: names[30], winner: true, ID: 31 },
              player2: { name: names[31], winner: true, ID: 32 },
            },
            {
              player1: { name: names[32], winner: true, ID: 33 },
              player2: { name: names[33], winner: true, ID: 34 },
            },
            {
              player1: { name: names[34], winner: true, ID: 35 },
              player2: { name: names[35], winner: true, ID: 36 },
            }
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 38) {
        let cloneroundsDummy = cloneRoundsDummyfn(6, 15);

        let cloneplayer2Vs = [];
        for (let index = 0; index < 2; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
          cloneplayer2Vs[index].player2.matchDate = matchSchedule[index];
        }
        let cloneplayer2Vs1 = [];
        for (let index = 0; index < 2; index++) {
          cloneplayer2Vs1.push(JSON.parse(JSON.stringify(player2Vs)));
          cloneplayer2Vs1[index].player2.matchDate = matchSchedule[index + 3];
        }

        let cloneplayer1Vs = [];
        cloneplayer1Vs[0] = JSON.parse(JSON.stringify(player1Vs));
        cloneplayer1Vs[0].player1.matchDate = matchSchedule[2];
        cloneplayer1Vs[1] = JSON.parse(JSON.stringify(player1Vs));
        cloneplayer1Vs[1].player1.matchDate = matchSchedule[5];

        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            {
              player1: { name: names[3] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[4] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[5] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[6], winner: true, ID: 7 },
              player2: { name: names[7], winner: true, ID: 8 },
            },
            {
              player1: { name: names[8] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[9] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[10], winner: true, ID: 11 },
              player2: { name: names[11], winner: true, ID: 12 },
            },
            {
              player1: { name: names[12] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[13] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[14] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[15] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[16] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[17] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[18] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[19] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[20], winner: true, ID: 2 },
              player2: { name: names[21], winner: true, ID: 3 },
            },
            {
              player1: { name: names[22] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[23] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[24] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[25], winner: true, ID: 7 },
              player2: { name: names[26], winner: true, ID: 8 },
            },
            {
              player1: { name: names[27] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[28] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[29], winner: true, ID: 11 },
              player2: { name: names[30], winner: true, ID: 12 },
            },
            {
              player1: { name: names[31] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[32] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[33] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[34] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[35] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[36] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[37] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            }
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs[0]
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              player2: { name: names[4], winner: true, ID: 5 },
            },
            {
              player1: { name: names[5], winner: true, ID: 6 },
              ...cloneplayer2Vs[1]
            },
            {
              player1: { name: names[8], winner: true, ID: 9 },
              player2: { name: names[9], winner: true, ID: 10 },
            },
            {
              ...cloneplayer1Vs[0],
              player2: { name: names[12], winner: true, ID: 13 },
            },
            {
              player1: { name: names[13], winner: true, ID: 14 },
              player2: { name: names[14], winner: true, ID: 15 },
            },
            {
              player1: { name: names[15], winner: true, ID: 16 },
              player2: { name: names[16], winner: true, ID: 17 },
            },
            {
              player1: { name: names[17], winner: true, ID: 18 },
              player2: { name: names[18], winner: true, ID: 19 },
            },
            {
              player1: { name: names[19], winner: true, ID: 20 },
              ...cloneplayer2Vs1[0]
            },
            {
              player1: { name: names[22], winner: true, ID: 23 },
              player2: { name: names[23], winner: true, ID: 24 },
            },
            {
              player1: { name: names[24], winner: true, ID: 25 },
              ...cloneplayer2Vs1[1]
            },
            {
              player1: { name: names[27], winner: true, ID: 28 },
              player2: { name: names[28], winner: true, ID: 29 },
            },
            {
              ...cloneplayer1Vs[1],
              player2: { name: names[31], winner: true, ID: 32 },
            },
            {
              player1: { name: names[32], winner: true, ID: 33 },
              player2: { name: names[33], winner: true, ID: 34 },
            },
            {
              player1: { name: names[34], winner: true, ID: 35 },
              player2: { name: names[35], winner: true, ID: 36 },
            },
            {
              player1: { name: names[36], winner: true, ID: 37 },
              player2: { name: names[37], winner: true, ID: 38 },
            }
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        ]
        console.log(rounds)
        return rounds;
      }
      else if (teamSize == 40) {
        let cloneroundsDummy = cloneRoundsDummyfn(9, 15);
        let rounds = [[], []];
        let number1 = 0, number2 = 0;
        while (number1 < 8) {
          rounds[0].push(...team5Round1(number2));
          rounds[1].push(...team5Round2(number2, number1));
          number2 += 5;
          ++number1;
        }
        rounds.push(
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        );
        return rounds;
      }
      else if (teamSize == 42) {
        let cloneroundsDummy = cloneRoundsDummyfn(10, 15);

        let cloneplayer2Vs = [];
        for (let index = 0; index < 8; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
          if (index > 0 && index < 4)
            cloneplayer2Vs[index].player2.matchDate = matchSchedule[index + 1];
          if (index > 4)
            cloneplayer2Vs[index].player2.matchDate = matchSchedule[index + 2];
        }
        cloneplayer2Vs[0].player2.matchDate = matchSchedule[0];
        cloneplayer2Vs[4].player2.matchDate = matchSchedule[5];

        var cloneplayer1Vs = JSON.parse(JSON.stringify(player1Vs));
        cloneplayer1Vs.player1.matchDate = matchSchedule[1];
        var cloneplayer1Vs1 = JSON.parse(JSON.stringify(player1Vs));
        cloneplayer1Vs1.player1.matchDate = matchSchedule[6];

        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              player2: { name: names[4], winner: true, ID: 5 },
            },
            {
              player1: { name: names[5] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[6] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              player2: { name: names[8], winner: true, ID: 9 }
            },
            {
              player1: { name: names[9] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[10] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[11] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[12], winner: true, ID: 13 },
              player2: { name: names[13], winner: true, ID: 14 },
            },
            {
              player1: { name: names[14] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[15] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[16] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[17], winner: true, ID: 18 },
              player2: { name: names[18], winner: true, ID: 19 },
            },
            {
              player1: { name: names[19] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[20] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[21] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[22], winner: true, ID: 23 },
              player2: { name: names[23], winner: true, ID: 24 },
            },
            {
              player1: { name: names[24], winner: true, ID: 25 },
              player2: { name: names[25], winner: true, ID: 26 },
            },
            {
              player1: { name: names[26] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[27] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[28], winner: true, ID: 29 },
              player2: { name: names[29], winner: true, ID: 30 }
            },
            {
              player1: { name: names[30] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[31] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[32] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[33], winner: true, ID: 34 },
              player2: { name: names[34], winner: true, ID: 35 },
            },
            {
              player1: { name: names[35] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[36] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[37] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[38], winner: true, ID: 39 },
              player2: { name: names[39], winner: true, ID: 40 },
            },
            {
              player1: { name: names[40] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[41] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs,
              player2: { name: names[5], winner: true, ID: 6 },
            },
            {
              player1: { name: names[6], winner: true, ID: 7 },
              ...cloneplayer2Vs[1]
            },
            {
              player1: { name: names[9], winner: true, ID: 10 },
              player2: { name: names[10], winner: true, ID: 11 }
            },
            {
              player1: { name: names[11], winner: true, ID: 12 },
              ...cloneplayer2Vs[2]
            },
            {
              player1: { name: names[14], winner: true, ID: 15 },
              player2: { name: names[15], winner: true, ID: 16 },
            },
            {
              player1: { name: names[16], winner: true, ID: 17 },
              ...cloneplayer2Vs[3]
            },
            {
              player1: { name: names[19], winner: true, ID: 20 },
              player2: { name: names[20], winner: true, ID: 21 },
            },
            {
              player1: { name: names[21], winner: true, ID: 22 },
              ...cloneplayer2Vs[4]
            },
            {
              ...cloneplayer1Vs1,
              player2: { name: names[26], winner: true, ID: 27 },
            },
            {
              player1: { name: names[27], winner: true, ID: 28 },
              ...cloneplayer2Vs[5]
            },
            {
              player1: { name: names[30], winner: true, ID: 31 },
              player2: { name: names[31], winner: true, ID: 32 }
            },
            {
              player1: { name: names[32], winner: true, ID: 33 },
              ...cloneplayer2Vs[6]
            },
            {
              player1: { name: names[35], winner: true, ID: 36 },
              player2: { name: names[36], winner: true, ID: 37 },
            },
            {
              player1: { name: names[37], winner: true, ID: 38 },
              ...cloneplayer2Vs[7]
            },
            {
              player1: { name: names[40], winner: true, ID: 41 },
              player2: { name: names[41], winner: true, ID: 42 },
            },
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        ]
        console.log(rounds);
        return rounds;
      }
      else if (teamSize == 44) {
        let cloneroundsDummy = cloneRoundsDummyfn(12, 15);

        let cloneplayer2Vs = [];
        for (let index = 0; index < 8; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
        }
        cloneplayer2Vs[0].player2.matchDate = matchSchedule[0];
        cloneplayer2Vs[1].player2.matchDate = matchSchedule[2];
        cloneplayer2Vs[2].player2.matchDate = matchSchedule[3];
        cloneplayer2Vs[3].player2.matchDate = matchSchedule[5];
        cloneplayer2Vs[4].player2.matchDate = matchSchedule[6];
        cloneplayer2Vs[5].player2.matchDate = matchSchedule[8];
        cloneplayer2Vs[6].player2.matchDate = matchSchedule[9];
        cloneplayer2Vs[7].player2.matchDate = matchSchedule[11];

        let cloneplayer1Vs = [];
        for (let index = 0; index < 4; index++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
        }
        cloneplayer1Vs[0].player1.matchDate = matchSchedule[1];
        cloneplayer1Vs[1].player1.matchDate = matchSchedule[4];
        cloneplayer1Vs[2].player1.matchDate = matchSchedule[7];
        cloneplayer1Vs[3].player1.matchDate = matchSchedule[10];

        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              player2: { name: names[4], winner: true, ID: 5 },
            },
            {
              player1: { name: names[5] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[6] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              player2: { name: names[8], winner: true, ID: 9 }
            },
            {
              player1: { name: names[9] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[10] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[11] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[12], winner: true, ID: 13 },
              player2: { name: names[13], winner: true, ID: 14 },
            },
            {
              player1: { name: names[14], winner: true, ID: 15 },
              player2: { name: names[15], winner: true, ID: 16 },
            },
            {
              player1: { name: names[16] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[17] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[18], winner: true, ID: 19 },
              player2: { name: names[19], winner: true, ID: 20 }
            },
            {
              player1: { name: names[20] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[21] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[22] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[23], winner: true, ID: 24 },
              player2: { name: names[24], winner: true, ID: 25 },
            },
            {
              player1: { name: names[25], winner: true, ID: 26 },
              player2: { name: names[26], winner: true, ID: 27 },
            },
            {
              player1: { name: names[27] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[28] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[29], winner: true, ID: 30 },
              player2: { name: names[30], winner: true, ID: 31 }
            },
            {
              player1: { name: names[31] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[32] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[33] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[34], winner: true, ID: 35 },
              player2: { name: names[35], winner: true, ID: 36 },
            },
            {
              player1: { name: names[36], winner: true, ID: 37 },
              player2: { name: names[37], winner: true, ID: 38 },
            },
            {
              player1: { name: names[38] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[39] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[40], winner: true, ID: 41 },
              player2: { name: names[41], winner: true, ID: 42 }
            },
            {
              player1: { name: names[42] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[43] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs[0],
              player2: { name: names[5], winner: true, ID: 6 },
            },
            {
              player1: { name: names[6], winner: true, ID: 7 },
              ...cloneplayer2Vs[1]
            },
            {
              player1: { name: names[9], winner: true, ID: 10 },
              player2: { name: names[10], winner: true, ID: 11 }
            },
            {
              player1: { name: names[11], winner: true, ID: 12 },
              ...cloneplayer2Vs[2]
            },
            {
              ...cloneplayer1Vs[1],
              player2: { name: names[16], winner: true, ID: 17 },
            },
            {
              player1: { name: names[17], winner: true, ID: 18 },
              ...cloneplayer2Vs[3]
            },
            {
              player1: { name: names[20], winner: true, ID: 21 },
              player2: { name: names[21], winner: true, ID: 22 }
            }, {
              player1: { name: names[22], winner: true, ID: 23 },
              ...cloneplayer2Vs[4]
            },
            {
              ...cloneplayer1Vs[2],
              player2: { name: names[27], winner: true, ID: 28 },
            },
            {
              player1: { name: names[28], winner: true, ID: 29 },
              ...cloneplayer2Vs[5]
            },
            {
              player1: { name: names[31], winner: true, ID: 32 },
              player2: { name: names[32], winner: true, ID: 33 }
            },
            {
              player1: { name: names[33], winner: true, ID: 34 },
              ...cloneplayer2Vs[6]
            },
            {
              ...cloneplayer1Vs[3],
              player2: { name: names[38], winner: true, ID: 39 },
            },
            {
              player1: { name: names[39], winner: true, ID: 40 },
              ...cloneplayer2Vs[7]
            },
            {
              player1: { name: names[42], winner: true, ID: 43 },
              player2: { name: names[43], winner: true, ID: 44 }
            },
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 46) {
        let cloneroundsDummy = cloneRoundsDummyfn(14, 15);

        let cloneplayer2Vs = [];
        for (let index = 0; index < 5; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
          cloneplayer2Vs[index].player2.matchDate = matchSchedule[index];
        }
        cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
        cloneplayer2Vs[5].player2.matchDate = matchSchedule[6];

        // let cloneplayer2Vs1 = [];
        for (let index = 6; index < 11; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
          cloneplayer2Vs[index].player2.matchDate = matchSchedule[index + 1];
        }
        cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
        cloneplayer2Vs[10].player2.matchDate = matchSchedule[11];
        cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
        cloneplayer2Vs[11].player2.matchDate = matchSchedule[13];

        let cloneplayer1Vs = JSON.parse(JSON.stringify(player1Vs));
        cloneplayer1Vs.player1.matchDate = matchSchedule[5];
        let cloneplayer1Vs1 = JSON.parse(JSON.stringify(player1Vs));
        cloneplayer1Vs1.player1.matchDate = matchSchedule[12];

        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            {
              player1: { name: names[3] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[4], winner: true, ID: 5 },
              player2: { name: names[5], winner: true, ID: 6 },
            },
            {
              player1: { name: names[6] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              player2: { name: names[8], winner: true, ID: 9 },
            },
            {
              player1: { name: names[9] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[10], winner: true, ID: 11 },
              player2: { name: names[11], winner: true, ID: 12 },
            },
            {
              player1: { name: names[12] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[13], winner: true, ID: 14 },
              player2: { name: names[14], winner: true, ID: 15 },
            },
            {
              player1: { name: names[15], winner: true, ID: 16 },
              player2: { name: names[16], winner: true, ID: 17 },
            },
            {
              player1: { name: names[17] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[18] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[19], winner: true, ID: 20 },
              player2: { name: names[20], winner: true, ID: 21 }
            },
            {
              player1: { name: names[21] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[22] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[23] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[24], winner: true, ID: 25 },
              player2: { name: names[25], winner: true, ID: 26 },
            },
            {
              player1: { name: names[26] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[27], winner: true, ID: 28 },
              player2: { name: names[28], winner: true, ID: 29 },
            },
            {
              player1: { name: names[29] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[30], winner: true, ID: 31 },
              player2: { name: names[31], winner: true, ID: 32 },
            },
            {
              player1: { name: names[32] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[33], winner: true, ID: 34 },
              player2: { name: names[34], winner: true, ID: 35 },
            },
            {
              player1: { name: names[35] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[36], winner: true, ID: 37 },
              player2: { name: names[37], winner: true, ID: 38 },
            },
            {
              player1: { name: names[38], winner: true, ID: 39 },
              player2: { name: names[39], winner: true, ID: 40 },
            },
            {
              player1: { name: names[40] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[41] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[42], winner: true, ID: 43 },
              player2: { name: names[43], winner: true, ID: 44 }
            },
            {
              player1: { name: names[44] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[45] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs[0]
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              ...cloneplayer2Vs[1]
            },
            {
              player1: { name: names[6], winner: true, ID: 7 },
              ...cloneplayer2Vs[2]
            },
            {
              player1: { name: names[9], winner: true, ID: 10 },
              ...cloneplayer2Vs[3]
            },
            {
              player1: { name: names[12], winner: true, ID: 13 },
              ...cloneplayer2Vs[4]
            },
            {
              ...cloneplayer1Vs,
              player2: { name: names[17], winner: true, ID: 18 },
            },
            {
              player1: { name: names[18], winner: true, ID: 19 },
              ...cloneplayer2Vs[5]
            },
            {
              player1: { name: names[21], winner: true, ID: 22 },
              player2: { name: names[22], winner: true, ID: 23 }
            },
            {
              player1: { name: names[23], winner: true, ID: 24 },
              ...cloneplayer2Vs[6]
            },
            {
              player1: { name: names[26], winner: true, ID: 27 },
              ...cloneplayer2Vs[7]
            },
            {
              player1: { name: names[29], winner: true, ID: 30 },
              ...cloneplayer2Vs[8]
            },
            {
              player1: { name: names[32], winner: true, ID: 33 },
              ...cloneplayer2Vs[9]
            },
            {
              player1: { name: names[35], winner: true, ID: 36 },
              ...cloneplayer2Vs[10]
            },
            {
              ...cloneplayer1Vs1,
              player2: { name: names[40], winner: true, ID: 41 },
            },
            {
              player1: { name: names[41], winner: true, ID: 42 },
              ...cloneplayer2Vs[11]
            },
            {
              player1: { name: names[44], winner: true, ID: 45 },
              player2: { name: names[45], winner: true, ID: 46 }
            },
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 48) {
        let cloneroundsDummy = cloneRoundsDummyfn(16, 15);
        let rounds = [[], []];
        let number1 = 0, number2 = 0;
        while (number1 < 16) {
          let round1 = team3Round1(number2, teamSize / 2);
          rounds[0].push(...round1);
          let round2 = team3Round2(number2, number1);
          rounds[1].push(...round2);
          number2 += 3;
          ++number1;
        }
        rounds.push(
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        );
        console.log(rounds)
        return rounds;
      }
      else if (teamSize == 50) {
        let cloneroundsDummy = cloneRoundsDummyfn(18, 15);

        let cloneplayer2Vs = [];
        for (let index = 0; index < 12; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
        }
        cloneplayer2Vs[0].player2.matchDate = matchSchedule[1];
        cloneplayer2Vs[1].player2.matchDate = matchSchedule[3];
        cloneplayer2Vs[2].player2.matchDate = matchSchedule[5];
        cloneplayer2Vs[3].player2.matchDate = matchSchedule[6];
        cloneplayer2Vs[4].player2.matchDate = matchSchedule[7];
        cloneplayer2Vs[5].player2.matchDate = matchSchedule[8];
        cloneplayer2Vs[6].player2.matchDate = matchSchedule[10];
        cloneplayer2Vs[7].player2.matchDate = matchSchedule[12];
        cloneplayer2Vs[8].player2.matchDate = matchSchedule[14];
        cloneplayer2Vs[9].player2.matchDate = matchSchedule[15];
        cloneplayer2Vs[10].player2.matchDate = matchSchedule[16];
        cloneplayer2Vs[11].player2.matchDate = matchSchedule[17];

        let cloneplayer1Vs = [];
        for (let index = 0; index < 6; index++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
        }
        cloneplayer1Vs[0].player1.matchDate = matchSchedule[0];
        cloneplayer1Vs[1].player1.matchDate = matchSchedule[2];
        cloneplayer1Vs[2].player1.matchDate = matchSchedule[4];
        cloneplayer1Vs[3].player1.matchDate = matchSchedule[9];
        cloneplayer1Vs[4].player1.matchDate = matchSchedule[11];
        cloneplayer1Vs[5].player1.matchDate = matchSchedule[13];

        var rounds = [
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              player2: { name: names[1], winner: true, ID: 2 },
            },
            {
              player1: { name: names[2], winner: true, ID: 3 },
              player2: { name: names[3], winner: true, ID: 4 }
            },
            {
              player1: { name: names[4], winner: true, ID: 5 },
              player2: { name: names[5], winner: true, ID: 6 }
            },
            {
              player1: { name: names[6] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[7] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[8], winner: true, ID: 9 },
              player2: { name: names[9], winner: true, ID: 10 },
            },
            {
              player1: { name: names[10], winner: true, ID: 11 },
              player2: { name: names[11], winner: true, ID: 12 },
            },
            {
              player1: { name: names[12] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[13] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[14], winner: true, ID: 15 },
              player2: { name: names[15], winner: true, ID: 16 },
            },
            {
              player1: { name: names[16] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[17], winner: true, ID: 18 },
              player2: { name: names[18], winner: true, ID: 19 },
            },
            {
              player1: { name: names[19] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[20], winner: true, ID: 21 },
              player2: { name: names[21], winner: true, ID: 22 },
            },
            {
              player1: { name: names[22] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[23], winner: true, ID: 24 },
              player2: { name: names[24], winner: true, ID: 25 },
            },
            {
              player1: { name: names[25], winner: true, ID: 26 },
              player2: { name: names[26], winner: true, ID: 27 },
            },
            {
              player1: { name: names[27], winner: true, ID: 28 },
              player2: { name: names[28], winner: true, ID: 29 }
            },
            {
              player1: { name: names[29], winner: true, ID: 30 },
              player2: { name: names[30], winner: true, ID: 31 }
            },
            {
              player1: { name: names[31] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[32] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[33], winner: true, ID: 34 },
              player2: { name: names[34], winner: true, ID: 35 },
            },
            {
              player1: { name: names[35], winner: true, ID: 36 },
              player2: { name: names[36], winner: true, ID: 37 },
            },
            {
              player1: { name: names[37] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[38] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[39], winner: true, ID: 40 },
              player2: { name: names[40], winner: true, ID: 41 },
            },
            {
              player1: { name: names[41] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[42], winner: true, ID: 42 },
              player2: { name: names[43], winner: true, ID: 43 },
            },
            {
              player1: { name: names[44] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[45], winner: true, ID: 46 },
              player2: { name: names[46], winner: true, ID: 47 },
            },
            {
              player1: { name: names[47] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[48], winner: true, ID: 48 },
              player2: { name: names[49], winner: true, ID: 49 },
            },
          ],
          [
            {
              ...cloneplayer1Vs[0],
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs[1],
              player2: { name: names[6], winner: true, ID: 7 },
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              ...cloneplayer2Vs[1]
            },
            {
              ...cloneplayer1Vs[2],
              player2: { name: names[12], winner: true, ID: 13 },
            },
            {
              player1: { name: names[13], winner: true, ID: 14 },
              ...cloneplayer2Vs[2]
            },
            {
              player1: { name: names[16], winner: true, ID: 17 },
              ...cloneplayer2Vs[3]
            },
            {
              player1: { name: names[19], winner: true, ID: 20 },
              ...cloneplayer2Vs[4]
            },
            {
              player1: { name: names[22], winner: true, ID: 23 },
              ...cloneplayer2Vs[5]
            },
            {
              ...cloneplayer1Vs[3],
              ...cloneplayer2Vs[6]
            },
            {
              ...cloneplayer1Vs[4],
              player2: { name: names[31], winner: true, ID: 32 },
            },
            {
              player1: { name: names[32], winner: true, ID: 33 },
              ...cloneplayer2Vs[7]
            },
            {
              ...cloneplayer1Vs[5],
              player2: { name: names[37], winner: true, ID: 38 },
            },
            {
              player1: { name: names[38], winner: true, ID: 39 },
              ...cloneplayer2Vs[8]
            },
            {
              player1: { name: names[41], winner: true, ID: 42 },
              ...cloneplayer2Vs[9]
            },
            {
              player1: { name: names[44], winner: true, ID: 45 },
              ...cloneplayer2Vs[10]
            },
            {
              player1: { name: names[47], winner: true, ID: 48 },
              ...cloneplayer2Vs[11]
            }
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        ]
        console.log(rounds)
        return rounds;
      }
      else if (teamSize == 52) {
        let cloneroundsDummy = cloneRoundsDummyfn(20, 15);

        let cloneplayer2Vs = [];
        for (let index = 0; index < 8; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
        }
        cloneplayer2Vs[0].player2.matchDate = matchSchedule[1];
        cloneplayer2Vs[1].player2.matchDate = matchSchedule[3];
        cloneplayer2Vs[2].player2.matchDate = matchSchedule[6];
        cloneplayer2Vs[3].player2.matchDate = matchSchedule[8];
        cloneplayer2Vs[4].player2.matchDate = matchSchedule[11];
        cloneplayer2Vs[5].player2.matchDate = matchSchedule[13];
        cloneplayer2Vs[6].player2.matchDate = matchSchedule[16];
        cloneplayer2Vs[7].player2.matchDate = matchSchedule[18];

        let cloneplayer1Vs = [];
        for (let index = 0; index < 12; index++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
        }
        cloneplayer1Vs[0].player1.matchDate = matchSchedule[0];
        cloneplayer1Vs[1].player1.matchDate = matchSchedule[2];
        cloneplayer1Vs[2].player1.matchDate = matchSchedule[4];
        cloneplayer1Vs[3].player1.matchDate = matchSchedule[5];
        cloneplayer1Vs[4].player1.matchDate = matchSchedule[7];
        cloneplayer1Vs[5].player1.matchDate = matchSchedule[9];
        cloneplayer1Vs[6].player1.matchDate = matchSchedule[0];
        cloneplayer1Vs[7].player1.matchDate = matchSchedule[12];
        cloneplayer1Vs[8].player1.matchDate = matchSchedule[14];
        cloneplayer1Vs[9].player1.matchDate = matchSchedule[15];
        cloneplayer1Vs[10].player1.matchDate = matchSchedule[17];
        cloneplayer1Vs[11].player1.matchDate = matchSchedule[19];

        var rounds = [
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              player2: { name: names[1], winner: true, ID: 2 },
            },
            {
              player1: { name: names[2], winner: true, ID: 3 },
              player2: { name: names[3], winner: true, ID: 4 }
            },
            {
              player1: { name: names[4], winner: true, ID: 5 },
              player2: { name: names[5], winner: true, ID: 6 }
            },
            {
              player1: { name: names[6] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[7] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[8], winner: true, ID: 9 },
              player2: { name: names[9], winner: true, ID: 10 },
            },
            {
              player1: { name: names[10], winner: true, ID: 11 },
              player2: { name: names[11], winner: true, ID: 12 },
            },
            {
              player1: { name: names[12] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[13], winner: true, ID: 14 },
              player2: { name: names[14], winner: true, ID: 15 },
            },
            {
              player1: { name: names[15], winner: true, ID: 16 },
              player2: { name: names[16], winner: true, ID: 17 }
            },
            {
              player1: { name: names[17], winner: true, ID: 18 },
              player2: { name: names[18], winner: true, ID: 19 }
            },
            {
              player1: { name: names[19] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[20] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[21], winner: true, ID: 22 },
              player2: { name: names[22], winner: true, ID: 23 },
            },
            {
              player1: { name: names[23], winner: true, ID: 24 },
              player2: { name: names[24], winner: true, ID: 25 },
            },
            {
              player1: { name: names[25] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[26], winner: true, ID: 27 },
              player2: { name: names[27], winner: true, ID: 28 },
            },
            {
              player1: { name: names[28], winner: true, ID: 29 },
              player2: { name: names[29], winner: true, ID: 30 }
            },
            {
              player1: { name: names[30], winner: true, ID: 31 },
              player2: { name: names[31], winner: true, ID: 32 }
            },
            {
              player1: { name: names[32] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[33] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[34], winner: true, ID: 35 },
              player2: { name: names[35], winner: true, ID: 36 },
            },
            {
              player1: { name: names[36], winner: true, ID: 37 },
              player2: { name: names[37], winner: true, ID: 38 },
            },
            {
              player1: { name: names[38] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[39], winner: true, ID: 40 },
              player2: { name: names[40], winner: true, ID: 41 },
            },
            {
              player1: { name: names[41], winner: true, ID: 42 },
              player2: { name: names[42], winner: true, ID: 43 }
            },
            {
              player1: { name: names[43], winner: true, ID: 44 },
              player2: { name: names[44], winner: true, ID: 45 }
            },
            {
              player1: { name: names[45] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[46] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[47], winner: true, ID: 46 },
              player2: { name: names[48], winner: true, ID: 47 },
            },
            {
              player1: { name: names[49], winner: true, ID: 48 },
              player2: { name: names[50], winner: true, ID: 49 },
            },
            {
              player1: { name: names[51] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            }
          ],
          [
            {
              ...cloneplayer1Vs[0],
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs[1],
              player2: { name: names[6], winner: true, ID: 7 },
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              ...cloneplayer2Vs[1]
            },
            {
              ...cloneplayer1Vs[2],
              player2: { name: names[12], winner: true, ID: 13 },
            },
            {
              ...cloneplayer1Vs[3],
              ...cloneplayer2Vs[2]
            },
            {
              ...cloneplayer1Vs[4],
              player2: { name: names[19], winner: true, ID: 20 },
            },
            {
              player1: { name: names[20], winner: true, ID: 21 },
              ...cloneplayer2Vs[3]
            },
            {
              ...cloneplayer1Vs[5],
              player2: { name: names[25], winner: true, ID: 26 },
            },
            {
              ...cloneplayer1Vs[6],
              ...cloneplayer2Vs[4]
            },
            {
              ...cloneplayer1Vs[7],
              player2: { name: names[32], winner: true, ID: 33 },
            },
            {
              player1: { name: names[33], winner: true, ID: 34 },
              ...cloneplayer2Vs[5]
            },
            {
              ...cloneplayer1Vs[8],
              player2: { name: names[38], winner: true, ID: 39 },
            },
            {
              ...cloneplayer1Vs[9],
              ...cloneplayer2Vs[6]
            },
            {
              ...cloneplayer1Vs[10],
              player2: { name: names[45], winner: true, ID: 46 },
            },
            {
              player1: { name: names[46], winner: true, ID: 47 },
              ...cloneplayer2Vs[7]
            },
            {
              ...cloneplayer1Vs[11],
              player2: { name: names[51], winner: true, ID: 52 },
            }
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 54) {
        let cloneroundsDummy = cloneRoundsDummyfn(22, 15);

        let cloneplayer1Vs = [];
        for (let index = 0; index < 10; index++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
        }
        cloneplayer1Vs[0].player1.matchDate = matchSchedule[1];
        cloneplayer1Vs[1].player1.matchDate = matchSchedule[3];
        cloneplayer1Vs[2].player1.matchDate = matchSchedule[5];
        cloneplayer1Vs[3].player1.matchDate = matchSchedule[7];
        cloneplayer1Vs[4].player1.matchDate = matchSchedule[10];
        cloneplayer1Vs[5].player1.matchDate = matchSchedule[12];
        cloneplayer1Vs[6].player1.matchDate = matchSchedule[14];
        cloneplayer1Vs[7].player1.matchDate = matchSchedule[16];
        cloneplayer1Vs[8].player1.matchDate = matchSchedule[18];
        cloneplayer1Vs[9].player1.matchDate = matchSchedule[21];

        let cloneplayer2Vs = [];
        for (let index = 0; index < 12; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
        }
        cloneplayer2Vs[0].player2.matchDate = matchSchedule[0];
        cloneplayer2Vs[1].player2.matchDate = matchSchedule[2];
        cloneplayer2Vs[2].player2.matchDate = matchSchedule[4];
        cloneplayer2Vs[3].player2.matchDate = matchSchedule[6];
        cloneplayer2Vs[4].player2.matchDate = matchSchedule[8];
        cloneplayer2Vs[5].player2.matchDate = matchSchedule[9];
        cloneplayer2Vs[6].player2.matchDate = matchSchedule[11];
        cloneplayer2Vs[7].player2.matchDate = matchSchedule[13];
        cloneplayer2Vs[8].player2.matchDate = matchSchedule[15];
        cloneplayer2Vs[9].player2.matchDate = matchSchedule[17];
        cloneplayer2Vs[10].player2.matchDate = matchSchedule[19];
        cloneplayer2Vs[11].player2.matchDate = matchSchedule[20];

        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              player2: { name: names[4], winner: true, ID: 5 },
            },
            {
              player1: { name: names[5], winner: true, ID: 6 },
              player2: { name: names[6], winner: true, ID: 7 },
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              player2: { name: names[8], winner: true, ID: 9 },
            },
            {
              player1: { name: names[9], winner: true, ID: 10 },
              player2: { name: names[10], winner: true, ID: 11 },
            },
            {
              player1: { name: names[11], winner: true, ID: 12 },
              player2: { name: names[12], winner: true, ID: 13 },
            },
            {
              player1: { name: names[13] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[14] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[15], winner: true, ID: 16 },
              player2: { name: names[16], winner: true, ID: 17 },
            },
            {
              player1: { name: names[17], winner: true, ID: 18 },
              player2: { name: names[18], winner: true, ID: 19 },
            },
            {
              player1: { name: names[19], winner: true, ID: 20 },
              player2: { name: names[20], winner: true, ID: 21 },
            },
            {
              player1: { name: names[21] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[22], winner: true, ID: 23 },
              player2: { name: names[23], winner: true, ID: 24 },
            },
            {
              player1: { name: names[24], winner: true, ID: 25 },
              player2: { name: names[25], winner: true, ID: 26 },
            },
            {
              player1: { name: names[26] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[27] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[28], winner: true, ID: 29 },
              player2: { name: names[29], winner: true, ID: 30 },
            },
            {
              player1: { name: names[30], winner: true, ID: 31 },
              player2: { name: names[31], winner: true, ID: 32 },
            },
            {
              player1: { name: names[32], winner: true, ID: 33 },
              player2: { name: names[33], winner: true, ID: 34 },
            },
            {
              player1: { name: names[34], winner: true, ID: 35 },
              player2: { name: names[35], winner: true, ID: 36 },
            },
            {
              player1: { name: names[36], winner: true, ID: 37 },
              player2: { name: names[37], winner: true, ID: 38 },
            },
            {
              player1: { name: names[38], winner: true, ID: 39 },
              player2: { name: names[39], winner: true, ID: 40 },
            },
            {
              player1: { name: names[40] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[41] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[42], winner: true, ID: 43 },
              player2: { name: names[43], winner: true, ID: 44 },
            },
            {
              player1: { name: names[44], winner: true, ID: 45 },
              player2: { name: names[45], winner: true, ID: 46 },
            },
            {
              player1: { name: names[46], winner: true, ID: 47 },
              player2: { name: names[47], winner: true, ID: 48 },
            },
            {
              player1: { name: names[48] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[49], winner: true, ID: 50 },
              player2: { name: names[50], winner: true, ID: 51 },
            },
            {
              player1: { name: names[51], winner: true, ID: 52 },
              player2: { name: names[52], winner: true, ID: 53 },
            },
            {
              player1: { name: names[53] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            }
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs[0],
              ...cloneplayer2Vs[1]
            },
            {
              ...cloneplayer1Vs[1],
              ...cloneplayer2Vs[2]
            },
            {
              ...cloneplayer1Vs[2],
              player2: { name: names[13], winner: true, ID: 14 },
            },
            {
              player1: { name: names[14], winner: true, ID: 15 },
              ...cloneplayer2Vs[3],
            },
            {
              ...cloneplayer1Vs[3],
              ...cloneplayer2Vs[4]
            },
            {
              player1: { name: names[21], winner: true, ID: 22 },
              ...cloneplayer2Vs[5]
            },
            {
              ...cloneplayer1Vs[4],
              player2: { name: names[26], winner: true, ID: 27 },
            },
            {
              player1: { name: names[27], winner: true, ID: 28 },
              ...cloneplayer2Vs[6]
            },
            {
              ...cloneplayer1Vs[5],
              ...cloneplayer2Vs[7]
            },
            {
              ...cloneplayer1Vs[6],
              ...cloneplayer2Vs[8]
            },
            {
              ...cloneplayer1Vs[7],
              player2: { name: names[40], winner: true, ID: 41 },
            },
            {
              player1: { name: names[41], winner: true, ID: 42 },
              ...cloneplayer2Vs[9],
            },
            {
              ...cloneplayer1Vs[8],
              ...cloneplayer2Vs[10]
            },
            {
              player1: { name: names[48], winner: true, ID: 49 },
              ...cloneplayer2Vs[11]
            },
            {
              ...cloneplayer1Vs[9],
              player2: { name: names[53], winner: true, ID: 54 },
            },
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 56) {
        let cloneroundsDummy = cloneRoundsDummyfn(24, 15);

        let cloneplayer1Vs = [];
        for (let index = 0; index < 8; index++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
          cloneplayer1Vs[index].player1.matchDate = matchSchedule[index * 3 + 1];
        }

        let cloneplayer2Vs = [];
        for (let index = 0; index < 16; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
        }
        cloneplayer2Vs[0].player2.matchDate = matchSchedule[0];
        cloneplayer2Vs[1].player2.matchDate = matchSchedule[2];
        cloneplayer2Vs[2].player2.matchDate = matchSchedule[3];
        cloneplayer2Vs[3].player2.matchDate = matchSchedule[5];
        cloneplayer2Vs[4].player2.matchDate = matchSchedule[6];
        cloneplayer2Vs[5].player2.matchDate = matchSchedule[8];
        cloneplayer2Vs[6].player2.matchDate = matchSchedule[9];
        cloneplayer2Vs[7].player2.matchDate = matchSchedule[11];
        cloneplayer2Vs[8].player2.matchDate = matchSchedule[12];
        cloneplayer2Vs[9].player2.matchDate = matchSchedule[14];
        cloneplayer2Vs[10].player2.matchDate = matchSchedule[15];
        cloneplayer2Vs[11].player2.matchDate = matchSchedule[17];
        cloneplayer2Vs[12].player2.matchDate = matchSchedule[18];
        cloneplayer2Vs[13].player2.matchDate = matchSchedule[20];
        cloneplayer2Vs[14].player2.matchDate = matchSchedule[21];
        cloneplayer2Vs[15].player2.matchDate = matchSchedule[23];

        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              player2: { name: names[4], winner: true, ID: 5 },
            },
            {
              player1: { name: names[5], winner: true, ID: 6 },
              player2: { name: names[6], winner: true, ID: 7 },
            },
            {
              player1: { name: names[7] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[8], winner: true, ID: 9 },
              player2: { name: names[9], winner: true, ID: 10 },
            },
            {
              player1: { name: names[10], winner: true, ID: 11 },
              player2: { name: names[11], winner: true, ID: 12 },
            },
            {
              player1: { name: names[12], winner: true, ID: 13 },
              player2: { name: names[13], winner: true, ID: 14 },
            },
            {
              player1: { name: names[14] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[15], winner: true, ID: 16 },
              player2: { name: names[16], winner: true, ID: 17 },
            },
            {
              player1: { name: names[17], winner: true, ID: 18 },
              player2: { name: names[18], winner: true, ID: 19 },
            },
            {
              player1: { name: names[19], winner: true, ID: 20 },
              player2: { name: names[20], winner: true, ID: 21 },
            },
            {
              player1: { name: names[21] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[22], winner: true, ID: 23 },
              player2: { name: names[23], winner: true, ID: 24 },
            },
            {
              player1: { name: names[24], winner: true, ID: 25 },
              player2: { name: names[25], winner: true, ID: 26 },
            },
            {
              player1: { name: names[26], winner: true, ID: 27 },
              player2: { name: names[27], winner: true, ID: 28 },
            },
            {
              player1: { name: names[28] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[29], winner: true, ID: 30 },
              player2: { name: names[30], winner: true, ID: 31 },
            },
            {
              player1: { name: names[31], winner: true, ID: 32 },
              player2: { name: names[32], winner: true, ID: 33 },
            },
            {
              player1: { name: names[33], winner: true, ID: 34 },
              player2: { name: names[34], winner: true, ID: 35 },
            },
            {
              player1: { name: names[35] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[36], winner: true, ID: 37 },
              player2: { name: names[37], winner: true, ID: 38 },
            },
            {
              player1: { name: names[38], winner: true, ID: 39 },
              player2: { name: names[39], winner: true, ID: 40 },
            },
            {
              player1: { name: names[40], winner: true, ID: 41 },
              player2: { name: names[41], winner: true, ID: 42 },
            },
            {
              player1: { name: names[42] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[43], winner: true, ID: 44 },
              player2: { name: names[44], winner: true, ID: 45 },
            },
            {
              player1: { name: names[45], winner: true, ID: 46 },
              player2: { name: names[46], winner: true, ID: 47 },
            },
            {
              player1: { name: names[47], winner: true, ID: 48 },
              player2: { name: names[48], winner: true, ID: 49 },
            },
            {
              player1: { name: names[49] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[50], winner: true, ID: 51 },
              player2: { name: names[51], winner: true, ID: 52 },
            },
            {
              player1: { name: names[52], winner: true, ID: 53 },
              player2: { name: names[53], winner: true, ID: 54 },
            },
            {
              player1: { name: names[54], winner: true, ID: 55 },
              player2: { name: names[55], winner: true, ID: 56 },
            }
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs[0],
              ...cloneplayer2Vs[1]
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              ...cloneplayer2Vs[2]
            },
            {
              ...cloneplayer1Vs[1],
              ...cloneplayer2Vs[3]
            },
            {
              player1: { name: names[14], winner: true, ID: 15 },
              ...cloneplayer2Vs[4]
            },
            {
              ...cloneplayer1Vs[2],
              ...cloneplayer2Vs[5]
            },
            {
              player1: { name: names[21], winner: true, ID: 22 },
              ...cloneplayer2Vs[6]
            },
            {
              ...cloneplayer1Vs[3],
              ...cloneplayer2Vs[7]
            },
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs[8]
            },
            {
              ...cloneplayer1Vs[4],
              ...cloneplayer2Vs[9]
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              ...cloneplayer2Vs[10]
            },
            {
              ...cloneplayer1Vs[5],
              ...cloneplayer2Vs[11]
            },
            {
              player1: { name: names[14], winner: true, ID: 15 },
              ...cloneplayer2Vs[12]
            },
            {
              ...cloneplayer1Vs[6],
              ...cloneplayer2Vs[13]
            },
            {
              player1: { name: names[21], winner: true, ID: 22 },
              ...cloneplayer2Vs[14]
            },
            {
              ...cloneplayer1Vs[7],
              ...cloneplayer2Vs[15]
            },
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 58) {
        let cloneroundsDummy = cloneRoundsDummyfn(26, 15);

        let cloneplayer1Vs = [];
        for (let index = 0; index < 10; index++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
          if (index > 4)
            cloneplayer1Vs[index].player1.matchDate = matchSchedule[index * 3 + 1];
        }
        cloneplayer1Vs[0].player1.matchDate = matchSchedule[1];
        cloneplayer1Vs[1].player1.matchDate = matchSchedule[3];
        cloneplayer1Vs[2].player1.matchDate = matchSchedule[5];
        cloneplayer1Vs[3].player1.matchDate = matchSchedule[8];
        cloneplayer1Vs[4].player1.matchDate = matchSchedule[11];
        cloneplayer1Vs[5].player1.matchDate = matchSchedule[14];
        cloneplayer1Vs[6].player1.matchDate = matchSchedule[16];
        cloneplayer1Vs[7].player1.matchDate = matchSchedule[18];
        cloneplayer1Vs[8].player1.matchDate = matchSchedule[21];
        cloneplayer1Vs[9].player1.matchDate = matchSchedule[24];

        let cloneplayer2Vs = [];
        for (let index = 0; index < 16; index++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
        }
        cloneplayer2Vs[0].player2.matchDate = matchSchedule[0];
        cloneplayer2Vs[1].player2.matchDate = matchSchedule[2];
        cloneplayer2Vs[2].player2.matchDate = matchSchedule[4];
        cloneplayer2Vs[3].player2.matchDate = matchSchedule[6];
        cloneplayer2Vs[4].player2.matchDate = matchSchedule[7];
        cloneplayer2Vs[5].player2.matchDate = matchSchedule[9];
        cloneplayer2Vs[6].player2.matchDate = matchSchedule[10];
        cloneplayer2Vs[7].player2.matchDate = matchSchedule[12];
        cloneplayer2Vs[8].player2.matchDate = matchSchedule[13];
        cloneplayer2Vs[9].player2.matchDate = matchSchedule[15];
        cloneplayer2Vs[10].player2.matchDate = matchSchedule[17];
        cloneplayer2Vs[11].player2.matchDate = matchSchedule[19];
        cloneplayer2Vs[12].player2.matchDate = matchSchedule[20];
        cloneplayer2Vs[13].player2.matchDate = matchSchedule[22];
        cloneplayer2Vs[14].player2.matchDate = matchSchedule[23];
        cloneplayer2Vs[15].player2.matchDate = matchSchedule[25];

        var rounds = [
          [
            {
              player1: { name: names[0] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[1], winner: true, ID: 2 },
              player2: { name: names[2], winner: true, ID: 3 },
            },
            {
              player1: { name: names[3], winner: true, ID: 4 },
              player2: { name: names[4], winner: true, ID: 5 },
            },
            {
              player1: { name: names[5], winner: true, ID: 6 },
              player2: { name: names[6], winner: true, ID: 7 },
            },
            {
              player1: { name: names[7], winner: true, ID: 8 },
              player2: { name: names[8], winner: true, ID: 9 },
            },
            {
              player1: { name: names[9], winner: true, ID: 10 },
              player2: { name: names[10], winner: true, ID: 11 },
            },
            {
              player1: { name: names[11], winner: true, ID: 12 },
              player2: { name: names[12], winner: true, ID: 13 },
            },
            {
              player1: { name: names[13], winner: true, ID: 14 },
              player2: { name: names[14], winner: true, ID: 15 },
            },
            {
              player1: { name: names[15] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[16], winner: true, ID: 17 },
              player2: { name: names[17], winner: true, ID: 18 },
            },
            {
              player1: { name: names[18], winner: true, ID: 19 },
              player2: { name: names[19], winner: true, ID: 20 },
            },
            {
              player1: { name: names[20], winner: true, ID: 21 },
              player2: { name: names[21], winner: true, ID: 22 },
            },
            {
              player1: { name: names[22] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[23], winner: true, ID: 24 },
              player2: { name: names[24], winner: true, ID: 25 },
            },
            {
              player1: { name: names[25], winner: true, ID: 26 },
              player2: { name: names[26], winner: true, ID: 27 },
            },
            {
              player1: { name: names[27], winner: true, ID: 28 },
              player2: { name: names[28], winner: true, ID: 29 },
            },
            {
              player1: { name: names[29] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[30], winner: true, ID: 31 },
              player2: { name: names[31], winner: true, ID: 32 },
            },
            {
              player1: { name: names[32], winner: true, ID: 33 },
              player2: { name: names[33], winner: true, ID: 34 },
            },
            {
              player1: { name: names[34], winner: true, ID: 35 },
              player2: { name: names[35], winner: true, ID: 36 },
            },
            {
              player1: { name: names[36], winner: true, ID: 37 },
              player2: { name: names[37], winner: true, ID: 38 },
            },
            {
              player1: { name: names[38], winner: true, ID: 39 },
              player2: { name: names[39], winner: true, ID: 40 },
            },
            {
              player1: { name: names[40], winner: true, ID: 41 },
              player2: { name: names[41], winner: true, ID: 42 },
            },
            {
              player1: { name: names[42], winner: true, ID: 43 },
              player2: { name: names[43], winner: true, ID: 44 },
            },
            {
              player1: { name: names[44] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[45], winner: true, ID: 46 },
              player2: { name: names[46], winner: true, ID: 47 },
            },
            {
              player1: { name: names[47], winner: true, ID: 48 },
              player2: { name: names[48], winner: true, ID: 49 },
            },
            {
              player1: { name: names[49], winner: true, ID: 50 },
              player2: { name: names[50], winner: true, ID: 51 },
            },
            {
              player1: { name: names[51] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[52], winner: true, ID: 53 },
              player2: { name: names[53], winner: true, ID: 54 },
            },
            {
              player1: { name: names[54], winner: true, ID: 55 },
              player2: { name: names[55], winner: true, ID: 56 },
            },
            {
              player1: { name: names[56], winner: true, ID: 57 },
              player2: { name: names[57], winner: true, ID: 58 },
            },
          ],
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              ...cloneplayer2Vs[0],
            },
            {
              ...cloneplayer1Vs[0],
              ...cloneplayer2Vs[1]
            },
            {
              ...cloneplayer1Vs[1],
              ...cloneplayer2Vs[2]
            },
            {
              ...cloneplayer1Vs[2],
              ...cloneplayer2Vs[3]
            },
            {
              player1: { name: names[15], winner: true, ID: 16 },
              ...cloneplayer2Vs[4]
            },
            {
              ...cloneplayer1Vs[3],
              ...cloneplayer2Vs[5]
            },
            {
              player1: { name: names[22], winner: true, ID: 23 },
              ...cloneplayer2Vs[6]
            },
            {
              ...cloneplayer1Vs[4],
              ...cloneplayer2Vs[7]
            },
            {
              player1: { name: names[29], winner: true, ID: 30 },
              ...cloneplayer2Vs[8],
            },
            {
              ...cloneplayer1Vs[5],
              ...cloneplayer2Vs[9]
            },
            {
              ...cloneplayer1Vs[6],
              ...cloneplayer2Vs[10]
            },
            {
              ...cloneplayer1Vs[7],
              ...cloneplayer2Vs[11]
            },
            {
              player1: { name: names[44], winner: true, ID: 45 },
              ...cloneplayer2Vs[12]
            },
            {
              ...cloneplayer1Vs[8],
              ...cloneplayer2Vs[13]
            },
            {
              player1: { name: names[51], winner: true, ID: 52 },
              ...cloneplayer2Vs[14]
            },
            {
              ...cloneplayer1Vs[9],
              ...cloneplayer2Vs[15]
            },
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 60) {
        let cloneroundsDummy = cloneRoundsDummyfn(28, 15);

        let cloneplayer1Vs = [];
        for (let index = 0, indexY = -1; index < 16; index++, indexY++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
          if (index < 8) {
            cloneplayer1Vs[index].player1.matchDate = matchSchedule[++indexY];
          }
        }
        cloneplayer1Vs[8].player1.matchDate = matchSchedule[13];
        cloneplayer1Vs[9].player1.matchDate = matchSchedule[15];
        cloneplayer1Vs[10].player1.matchDate = matchSchedule[17];
        cloneplayer1Vs[11].player1.matchDate = matchSchedule[19];
        cloneplayer1Vs[12].player1.matchDate = matchSchedule[21];
        cloneplayer1Vs[13].player1.matchDate = matchSchedule[23];
        cloneplayer1Vs[14].player1.matchDate = matchSchedule[25];
        cloneplayer1Vs[15].player1.matchDate = matchSchedule[27];

        let cloneplayer2Vs = [];
        for (let index = 0, indexY = 0; index < 12; index++, indexY++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
          if (index < 6) {
            cloneplayer2Vs[index].player2.matchDate = matchSchedule[++indexY];
          }
        }
        cloneplayer2Vs[6].player2.matchDate = matchSchedule[16];
        cloneplayer2Vs[7].player2.matchDate = matchSchedule[18];
        cloneplayer2Vs[8].player2.matchDate = matchSchedule[20];
        cloneplayer2Vs[9].player2.matchDate = matchSchedule[22];
        cloneplayer2Vs[10].player2.matchDate = matchSchedule[24];
        cloneplayer2Vs[11].player2.matchDate = matchSchedule[26];

        var rounds = [
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              player2: { name: names[1], winner: true, ID: 2 },
            },
            {
              player1: { name: names[2], winner: true, ID: 3 },
              player2: { name: names[3], winner: true, ID: 4 },
            },
            {
              player1: { name: names[4], winner: true, ID: 5 },
              player2: { name: names[5], winner: true, ID: 6 }
            },
            {
              player1: { name: names[6], winner: true, ID: 7 },
              player2: { name: names[7], winner: true, ID: 8 },
            },
            {
              player1: { name: names[8], winner: true, ID: 9 },
              player2: { name: names[9], winner: true, ID: 10 },
            },
            {
              player1: { name: names[10], winner: true, ID: 11 },
              player2: { name: names[11], winner: true, ID: 12 }
            },
            {
              player1: { name: names[12], winner: true, ID: 13 },
              player2: { name: names[13], winner: true, ID: 14 }
            },
            {
              player1: { name: names[14] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[15], winner: true, ID: 16 },
              player2: { name: names[16], winner: true, ID: 17 },
            },
            {
              player1: { name: names[17], winner: true, ID: 18 },
              player2: { name: names[18], winner: true, ID: 19 },
            },
            {
              player1: { name: names[19], winner: true, ID: 20 },
              player2: { name: names[20], winner: true, ID: 21 }
            },
            {
              player1: { name: names[21], winner: true, ID: 22 },
              player2: { name: names[22], winner: true, ID: 23 },
            },
            {
              player1: { name: names[23], winner: true, ID: 24 },
              player2: { name: names[24], winner: true, ID: 25 },
            },
            {
              player1: { name: names[25], winner: true, ID: 26 },
              player2: { name: names[26], winner: true, ID: 27 }
            },
            {
              player1: { name: names[27], winner: true, ID: 28 },
              player2: { name: names[28], winner: true, ID: 29 }
            },
            {
              player1: { name: names[29] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[30], winner: true, ID: 31 },
              player2: { name: names[31], winner: true, ID: 32 },
            },
            {
              player1: { name: names[32], winner: true, ID: 33 },
              player2: { name: names[33], winner: true, ID: 34 },
            },
            {
              player1: { name: names[34], winner: true, ID: 35 },
              player2: { name: names[35], winner: true, ID: 36 }
            },
            {
              player1: { name: names[36], winner: true, ID: 37 },
              player2: { name: names[37], winner: true, ID: 38 },
            },
            {
              player1: { name: names[38], winner: true, ID: 39 },
              player2: { name: names[39], winner: true, ID: 40 },
            },
            {
              player1: { name: names[40], winner: true, ID: 41 },
              player2: { name: names[41], winner: true, ID: 42 }
            },
            {
              player1: { name: names[42], winner: true, ID: 43 },
              player2: { name: names[42], winner: true, ID: 44 }
            },
            {
              player1: { name: names[44] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[45], winner: true, ID: 46 },
              player2: { name: names[46], winner: true, ID: 47 },
            },
            {
              player1: { name: names[47], winner: true, ID: 48 },
              player2: { name: names[48], winner: true, ID: 49 },
            },
            {
              player1: { name: names[49], winner: true, ID: 50 },
              player2: { name: names[50], winner: true, ID: 51 }
            },
            {
              player1: { name: names[51], winner: true, ID: 52 },
              player2: { name: names[52], winner: true, ID: 53 },
            },
            {
              player1: { name: names[53], winner: true, ID: 54 },
              player2: { name: names[54], winner: true, ID: 55 },
            },
            {
              player1: { name: names[55], winner: true, ID: 56 },
              player2: { name: names[56], winner: true, ID: 57 }
            },
            {
              player1: { name: names[57], winner: true, ID: 58 },
              player2: { name: names[58], winner: true, ID: 59 }
            },
            {
              player1: { name: names[59] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
          ],
          [
            {
              ...cloneplayer1Vs[0],
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs[1],
              ...cloneplayer2Vs[1]
            },
            {
              ...cloneplayer1Vs[2],
              ...cloneplayer2Vs[2]
            },
            {
              ...cloneplayer1Vs[3],
              player2: { name: names[14], winner: true, ID: 15 },
            },
            {
              ...cloneplayer1Vs[4],
              ...cloneplayer2Vs[3]
            },
            {
              ...cloneplayer1Vs[5],
              ...cloneplayer2Vs[4]
            },
            {
              ...cloneplayer1Vs[6],
              ...cloneplayer2Vs[5]
            },
            {
              ...cloneplayer1Vs[7],
              player2: { name: names[29], winner: true, ID: 30 },
            },
            {
              ...cloneplayer1Vs[8],
              ...cloneplayer2Vs[6]
            },
            {
              ...cloneplayer1Vs[9],
              ...cloneplayer2Vs[7]
            },
            {
              ...cloneplayer1Vs[10],
              ...cloneplayer2Vs[8]
            },
            {
              ...cloneplayer1Vs[11],
              player2: { name: names[42], winner: true, ID: 43 },
            },
            {
              ...cloneplayer1Vs[12],
              ...cloneplayer2Vs[9]
            },
            {
              ...cloneplayer1Vs[13],
              ...cloneplayer2Vs[10]
            },
            {
              ...cloneplayer1Vs[14],
              ...cloneplayer2Vs[11]
            },
            {
              ...cloneplayer1Vs[15],
              player2: { name: names[57], winner: true, ID: 58 },
            }
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
      else if (teamSize == 62) {
        let cloneroundsDummy = cloneRoundsDummyfn(30, 15);

        let cloneplayer1Vs = [];
        for (let index = 0, indexY = -1; index < 16; index++, indexY++) {
          cloneplayer1Vs.push(JSON.parse(JSON.stringify(player1Vs)));
          cloneplayer1Vs[index].player1.matchDate = matchSchedule[++indexY];
        }

        let cloneplayer2Vs = [];
        for (let index = 0, indexY = 0; index < 14; index++, indexY++) {
          cloneplayer2Vs.push(JSON.parse(JSON.stringify(player2Vs)));
          cloneplayer2Vs[index].player2.matchDate = matchSchedule[++indexY];
        }

        var rounds = [
          [
            {
              player1: { name: names[0], winner: true, ID: 1 },
              player2: { name: names[1], winner: true, ID: 2 },
            },
            {
              player1: { name: names[2], winner: true, ID: 3 },
              player2: { name: names[3], winner: true, ID: 4 },
            },
            {
              player1: { name: names[4], winner: true, ID: 5 },
              player2: { name: names[5], winner: true, ID: 6 }
            },
            {
              player1: { name: names[6], winner: true, ID: 7 },
              player2: { name: names[7], winner: true, ID: 8 },
            },
            {
              player1: { name: names[8], winner: true, ID: 9 },
              player2: { name: names[9], winner: true, ID: 10 },
            },
            {
              player1: { name: names[10], winner: true, ID: 11 },
              player2: { name: names[11], winner: true, ID: 12 },
            },
            {
              player1: { name: names[12], winner: true, ID: 13 },
              player2: { name: names[13], winner: true, ID: 14 }
            },
            {
              player1: { name: names[14], winner: true, ID: 15 },
              player2: { name: names[15], winner: true, ID: 16 },
            },
            {
              player1: { name: names[16], winner: true, ID: 17 },
              player2: { name: names[17], winner: true, ID: 18 },
            },
            {
              player1: { name: names[18], winner: true, ID: 19 },
              player2: { name: names[19], winner: true, ID: 20 },
            },
            {
              player1: { name: names[20], winner: true, ID: 21 },
              player2: { name: names[21], winner: true, ID: 22 }
            },
            {
              player1: { name: names[22], winner: true, ID: 23 },
              player2: { name: names[23], winner: true, ID: 24 },
            },
            {
              player1: { name: names[24], winner: true, ID: 25 },
              player2: { name: names[25], winner: true, ID: 26 },
            },
            {
              player1: { name: names[26], winner: true, ID: 27 },
              player2: { name: names[27], winner: true, ID: 28 }
            },
            {
              player1: { name: names[28], winner: true, ID: 29 },
              player2: { name: names[29], winner: true, ID: 30 }
            },
            {
              player1: { name: names[30] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
            {
              player1: { name: names[31], winner: true, ID: 32 },
              player2: { name: names[32], winner: true, ID: 33 },
            },
            {
              player1: { name: names[33], winner: true, ID: 34 },
              player2: { name: names[34], winner: true, ID: 35 },
            },
            {
              player1: { name: names[35], winner: true, ID: 36 },
              player2: { name: names[36], winner: true, ID: 37 }
            },
            {
              player1: { name: names[37], winner: true, ID: 38 },
              player2: { name: names[38], winner: true, ID: 39 },
            },
            {
              player1: { name: names[39], winner: true, ID: 40 },
              player2: { name: names[40], winner: true, ID: 41 },
            },
            {
              player1: { name: names[41], winner: true, ID: 42 },
              player2: { name: names[42], winner: true, ID: 43 },
            },
            {
              player1: { name: names[43], winner: true, ID: 44 },
              player2: { name: names[44], winner: true, ID: 45 }
            },
            {
              player1: { name: names[45], winner: true, ID: 46 },
              player2: { name: names[46], winner: true, ID: 47 },
            },
            {
              player1: { name: names[47], winner: true, ID: 48 },
              player2: { name: names[48], winner: true, ID: 49 },
            },
            {
              player1: { name: names[49], winner: true, ID: 50 },
              player2: { name: names[50], winner: true, ID: 51 },
            },
            {
              player1: { name: names[51], winner: true, ID: 52 },
              player2: { name: names[52], winner: true, ID: 53 }
            },
            {
              player1: { name: names[53], winner: true, ID: 54 },
              player2: { name: names[54], winner: true, ID: 55 },
            },
            {
              player1: { name: names[55], winner: true, ID: 56 },
              player2: { name: names[56], winner: true, ID: 57 },
            },
            {
              player1: { name: names[57], winner: true, ID: 58 },
              player2: { name: names[58], winner: true, ID: 59 }
            },
            {
              player1: { name: names[59], winner: true, ID: 60 },
              player2: { name: names[60], winner: true, ID: 61 }
            },
            {
              player1: { name: names[61] + `(Bye)`, winner: true, ID: 101 },
              ...round1ByePlr2
            },
          ],
          [
            {
              ...cloneplayer1Vs[0],
              ...cloneplayer2Vs[0]
            },
            {
              ...cloneplayer1Vs[1],
              ...cloneplayer2Vs[1]
            },
            {
              ...cloneplayer1Vs[2],
              ...cloneplayer2Vs[2]
            },
            {
              ...cloneplayer1Vs[3],
              ...cloneplayer2Vs[3]
            },
            {
              ...cloneplayer1Vs[4],
              ...cloneplayer2Vs[4]
            },
            {
              ...cloneplayer1Vs[5],
              ...cloneplayer2Vs[5]
            },
            {
              ...cloneplayer1Vs[6],
              ...cloneplayer2Vs[6]
            },
            {
              ...cloneplayer1Vs[7],
              player2: { name: names[30], winner: true, ID: 31 },
            },
            {
              ...cloneplayer1Vs[8],
              ...cloneplayer2Vs[7]
            },
            {
              ...cloneplayer1Vs[9],
              ...cloneplayer2Vs[8]
            },
            {
              ...cloneplayer1Vs[10],
              ...cloneplayer2Vs[9]
            },
            {
              ...cloneplayer1Vs[11],
              ...cloneplayer2Vs[10]
            },
            {
              ...cloneplayer1Vs[12],
              ...cloneplayer2Vs[11]
            },
            {
              ...cloneplayer1Vs[13],
              ...cloneplayer2Vs[12]
            },
            {
              ...cloneplayer1Vs[14],
              ...cloneplayer2Vs[13]
            },
            {
              ...cloneplayer1Vs[15],
              player2: { name: names[61], winner: true, ID: 62 },
            }
          ],
          [
            cloneroundsDummy[0],
            cloneroundsDummy[1],
            cloneroundsDummy[2],
            cloneroundsDummy[3],
            cloneroundsDummy[4],
            cloneroundsDummy[5],
            cloneroundsDummy[6],
            cloneroundsDummy[7]
          ],
          [
            cloneroundsDummy[8],
            cloneroundsDummy[9],
            cloneroundsDummy[10],
            cloneroundsDummy[11]
          ],
          [cloneroundsDummy[12], cloneroundsDummy[13]],
          [cloneroundsDummy[14]],
          [roundsFinalDummy]
        ]
        return rounds;
      }
    }
  }

  // jQuery call for rendering the required layout for bracket.
  $('#tournamentBracket').brackets({
    titles: titlesfn(noOfTeamsValue), //-- Fn() returns Array with respective titles for each fixtures.
    rounds: tournamentBracketGenerator(noOfTeamsValue), //-- Fn() returns JSON with matches of the each round.
    color_title: 'black',
    color_player: 'black',
    border_color: 'darkgrey',
    bg_player: 'lightgrey',
    color_player_hover: '',
    bg_player_hover: '',
    border_radius_player: '5px',
    border_radius_lines: '3px',
  });

  // Border style said to be invisible for the byes.
  {
    if (noOfTeamsValue == 3) {
      styleBorder(11, 12);
    } else if (noOfTeamsValue == 5) {
      styleBorder(11, 12);
      styleBorder(31, 32);
      styleBorder(41, 42);
    } else if (noOfTeamsValue == 6) {
      let number1 = 11, number2 = 12
      while (number1 <= 31) {
        styleBorder(number1, number2);
        number1 += 20;
        number2 += 20;
      }
    } else if (noOfTeamsValue == 7) {
      styleBorder(41, 42);
    } else if (noOfTeamsValue == 9) {
      styleBorder(21, 22);
      styleBorder(31, 32);
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(61, 62);
      styleBorder(71, 72);
      styleBorder(81, 82);
    } else if (noOfTeamsValue == 10) {
      styleBorder(11, 12);
      styleBorder(31, 32);
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(71, 72);
      styleBorder(81, 82);
    } else if (noOfTeamsValue == 11) {
      styleBorder(11, 12);
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(71, 72);
      styleBorder(81, 82);
    } else if (noOfTeamsValue == 12) {
      let number1 = 11, number2 = 12
      while (number1 <= 71) {
        styleBorder(number1, number2);
        number1 += 20;
        number2 += 20;
      }
    } else if (noOfTeamsValue == 13) {
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(81, 82);
    } else if (noOfTeamsValue == 14) {
      styleBorder(11, 12);
      styleBorder(51, 52);
    } else if (noOfTeamsValue == 15) {
      styleBorder(81, 82);
    } else if (noOfTeamsValue == 17) {
      styleBorder(11, 12);
      styleBorder(31, 32);
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(61, 62);
      styleBorder(71, 72);
      styleBorder(81, 82);
      styleBorder(91, 92);
      styleBorder(101, 102);
      styleBorder(111, 112);
      styleBorder(121, 122);
      styleBorder(131, 132);
      styleBorder(141, 142);
      styleBorder(151, 152);
      styleBorder(161, 162);
    } else if (noOfTeamsValue == 18) {
      styleBorder(11, 12);
      styleBorder(31, 32);
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(61, 62);
      styleBorder(71, 72);
      styleBorder(81, 82);
      styleBorder(91, 92);
      styleBorder(111, 112);
      styleBorder(121, 122);
      styleBorder(131, 132);
      styleBorder(141, 142);
      styleBorder(151, 152);
      styleBorder(161, 162);
    } else if (noOfTeamsValue == 19) {
      styleBorder(11, 12);
      styleBorder(31, 32);
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(71, 72);
      styleBorder(81, 82);
      styleBorder(101, 102);
      styleBorder(111, 112);
      styleBorder(121, 122);
      styleBorder(131, 132);
      styleBorder(141, 142);
      styleBorder(151, 152);
      styleBorder(161, 162);
    } else if (noOfTeamsValue == 20) {
      styleBorder(11, 12);
      styleBorder(31, 32);
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(71, 72);
      styleBorder(81, 82);
      styleBorder(91, 92);
      styleBorder(111, 112);
      styleBorder(121, 122);
      styleBorder(131, 132);
      styleBorder(151, 152);
      styleBorder(161, 162);
    } else if (noOfTeamsValue == 21) {
      styleBorder(11, 12);
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(71, 72);
      styleBorder(81, 82);
      styleBorder(91, 92);
      styleBorder(111, 112);
      styleBorder(121, 122);
      styleBorder(131, 132);
      styleBorder(151, 152);
      styleBorder(161, 162);
    } else if (noOfTeamsValue == 22) {
      styleBorder(11, 12);
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(71, 72);
      styleBorder(81, 82);
      styleBorder(91, 92);
      styleBorder(121, 122);
      styleBorder(131, 132);
      styleBorder(151, 152);
      styleBorder(161, 162);
    } else if (noOfTeamsValue == 23) {
      styleBorder(11, 12);
      styleBorder(31, 32);
      styleBorder(51, 52);
      styleBorder(71, 72);
      styleBorder(91, 92);
      styleBorder(121, 122);
      styleBorder(131, 132);
      styleBorder(151, 152);
      styleBorder(161, 162);
    } else if (noOfTeamsValue == 24) {
      let number1 = 11, number2 = 12
      while (number1 <= 151) {
        styleBorder(number1, number2);
        number1 += 20;
        number2 += 20;
      }
    } else if (noOfTeamsValue == 25) {
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(81, 82);
      styleBorder(91, 92);
      styleBorder(111, 112);
      styleBorder(131, 132);
      styleBorder(151, 152);
    } else if (noOfTeamsValue == 26) {
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(81, 82);
      styleBorder(121, 122);
      styleBorder(131, 132);
      styleBorder(161, 162);
    } else if (noOfTeamsValue == 27) {
      styleBorder(11, 12);
      styleBorder(81, 82);
      styleBorder(91, 92);
      styleBorder(131, 132);
      styleBorder(161, 162);
    } else if (noOfTeamsValue == 28) {
      styleBorder(11, 12);
      styleBorder(51, 52);
      styleBorder(91, 92);
      styleBorder(131, 132);
    } else if (noOfTeamsValue == 29) {
      styleBorder(11, 12);
      styleBorder(91, 92);
      styleBorder(131, 132);
    } else if (noOfTeamsValue == 30) {
      styleBorder(81, 82);
      styleBorder(161, 162);
    } else if (noOfTeamsValue == 31) {
      styleBorder(161, 162);
    } else if (noOfTeamsValue == 33) {
      styleBorder(11, 12);
      styleBorder(31, 32);
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(61, 62);
      styleBorder(71, 72);
      styleBorder(81, 82);
      styleBorder(91, 92);
      styleBorder(101, 102);
      styleBorder(111, 112);
      styleBorder(121, 122);
      styleBorder(131, 132);
      styleBorder(141, 142);
      styleBorder(151, 152);
      styleBorder(161, 162);
      styleBorder(171, 172);
      styleBorder(181, 182);
      styleBorder(191, 192);
      styleBorder(201, 202);
      styleBorder(211, 212);
      styleBorder(221, 222);
      styleBorder(231, 232);
      styleBorder(241, 242);
      styleBorder(251, 252);
      styleBorder(261, 262);
      styleBorder(271, 272);
      styleBorder(281, 282);
      styleBorder(291, 292);
      styleBorder(301, 302);
      styleBorder(311, 312);
      styleBorder(321, 322);
    } else if (noOfTeamsValue == 34) {
      styleBorder(11, 12);
      styleBorder(31, 32);
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(61, 62);
      styleBorder(71, 72);
      styleBorder(81, 82);
      styleBorder(91, 92);
      styleBorder(101, 102);
      styleBorder(111, 112);
      styleBorder(121, 122);
      styleBorder(131, 132);
      styleBorder(141, 142);
      styleBorder(151, 152);
      styleBorder(161, 162);
      styleBorder(171, 172);
      styleBorder(191, 192);
      styleBorder(201, 202);
      styleBorder(211, 212);
      styleBorder(221, 222);
      styleBorder(231, 232);
      styleBorder(241, 242);
      styleBorder(251, 252);
      styleBorder(261, 262);
      styleBorder(271, 272);
      styleBorder(281, 282);
      styleBorder(291, 292);
      styleBorder(301, 302);
      styleBorder(311, 312);
      styleBorder(321, 322);
    } else if (noOfTeamsValue == 35) {
      styleBorder(11, 12);
      styleBorder(31, 32);
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(61, 62);
      styleBorder(71, 72);
      styleBorder(81, 82);
      styleBorder(91, 92);
      styleBorder(111, 112);
      styleBorder(121, 122);
      styleBorder(131, 132);
      styleBorder(141, 142);
      styleBorder(151, 152);
      styleBorder(161, 162);
      styleBorder(171, 172);
      styleBorder(191, 192);
      styleBorder(201, 202);
      styleBorder(211, 212);
      styleBorder(221, 222);
      styleBorder(231, 232);
      styleBorder(241, 242);
      styleBorder(251, 252);
      styleBorder(261, 262);
      styleBorder(271, 272);
      styleBorder(281, 282);
      styleBorder(291, 292);
      styleBorder(301, 302);
      styleBorder(311, 312);
      styleBorder(321, 322);
    } else if (noOfTeamsValue == 36) {
      styleBorder(11, 12);
      styleBorder(31, 32);
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(61, 62);
      styleBorder(71, 72);
      styleBorder(81, 82);
      styleBorder(91, 92);
      styleBorder(111, 112);
      styleBorder(121, 122);
      styleBorder(131, 132);
      styleBorder(141, 142);
      styleBorder(151, 152);
      styleBorder(161, 162);
      styleBorder(171, 172);
      styleBorder(191, 192);
      styleBorder(201, 202);
      styleBorder(211, 212);
      styleBorder(221, 222);
      styleBorder(231, 232);
      styleBorder(241, 242);
      styleBorder(251, 252);
      styleBorder(271, 272);
      styleBorder(281, 282);
      styleBorder(291, 292);
      styleBorder(301, 302);
      styleBorder(311, 312);
      styleBorder(321, 322);
    } else if (noOfTeamsValue == 37) {
      styleBorder(11, 12);
      styleBorder(31, 32);
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(71, 72);
      styleBorder(81, 82);
      styleBorder(101, 102);
      styleBorder(111, 112);
      styleBorder(121, 122);
      styleBorder(131, 132);
      styleBorder(141, 142);
      styleBorder(151, 152);
      styleBorder(161, 162);
      styleBorder(171, 172);
      styleBorder(191, 192);
      styleBorder(201, 202);
      styleBorder(211, 212);
      styleBorder(221, 222);
      styleBorder(231, 232);
      styleBorder(241, 242);
      styleBorder(251, 252);
      styleBorder(271, 272);
      styleBorder(281, 282);
      styleBorder(291, 292);
      styleBorder(301, 302);
      styleBorder(311, 312);
      styleBorder(321, 322);
    } else if (noOfTeamsValue == 38) {
      styleBorder(11, 12);
      styleBorder(31, 32);
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(71, 72);
      styleBorder(81, 82);
      styleBorder(111, 112);
      styleBorder(121, 122);
      styleBorder(131, 132);
      styleBorder(141, 142);
      styleBorder(151, 152);
      styleBorder(161, 162);
      styleBorder(171, 172);
      styleBorder(191, 192);
      styleBorder(201, 202);
      styleBorder(211, 212);
      styleBorder(231, 232);
      styleBorder(241, 242);
      styleBorder(271, 272);
      styleBorder(281, 282);
      styleBorder(291, 292);
      styleBorder(301, 302);
      styleBorder(311, 312);
      styleBorder(321, 322);
    } else if (noOfTeamsValue == 39) {
      styleBorder(11, 12);
      styleBorder(31, 32);
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(71, 72);
      styleBorder(81, 82);
      styleBorder(91, 92);
      styleBorder(111, 112);
      styleBorder(121, 122);
      styleBorder(131, 132);
      styleBorder(151, 152);
      styleBorder(161, 162);
      styleBorder(171, 172);
      styleBorder(191, 192);
      styleBorder(201, 202);
      styleBorder(211, 212);
      styleBorder(231, 232);
      styleBorder(241, 242);
      styleBorder(261, 262);
      styleBorder(271, 272);
      styleBorder(281, 282);
      styleBorder(291, 292);
      styleBorder(301, 302);
      styleBorder(311, 312);
      styleBorder(321, 322);
    } else if (noOfTeamsValue == 40) {
      styleBorder(11, 12);
      styleBorder(31, 32);
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(71, 72);
      styleBorder(81, 82);
      styleBorder(91, 92);
      styleBorder(111, 112);
      styleBorder(121, 122);
      styleBorder(131, 132);
      styleBorder(151, 152);
      styleBorder(161, 162);
      styleBorder(171, 172);
      styleBorder(191, 192);
      styleBorder(201, 202);
      styleBorder(211, 212);
      styleBorder(231, 232);
      styleBorder(241, 242);
      styleBorder(251, 252);
      styleBorder(271, 272);
      styleBorder(281, 282);
      styleBorder(291, 292);
      styleBorder(311, 312);
      styleBorder(321, 322);
    } else if (noOfTeamsValue == 41) {
      styleBorder(11, 12);
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(71, 72);
      styleBorder(81, 82);
      styleBorder(91, 92);
      styleBorder(111, 112);
      styleBorder(121, 122);
      styleBorder(131, 132);
      styleBorder(151, 152);
      styleBorder(161, 162);
      styleBorder(171, 172);
      styleBorder(191, 192);
      styleBorder(201, 202);
      styleBorder(211, 212);
      styleBorder(231, 232);
      styleBorder(241, 242);
      styleBorder(251, 252);
      styleBorder(271, 272);
      styleBorder(281, 282);
      styleBorder(291, 292);
      styleBorder(311, 312);
      styleBorder(321, 322);
    } else if (noOfTeamsValue == 42) {
      styleBorder(11, 12);
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(71, 72);
      styleBorder(81, 82);
      styleBorder(91, 92);
      styleBorder(111, 112);
      styleBorder(121, 122);
      styleBorder(131, 132);
      styleBorder(151, 152);
      styleBorder(161, 162);
      styleBorder(171, 172);
      styleBorder(201, 202);
      styleBorder(211, 212);
      styleBorder(231, 232);
      styleBorder(241, 242);
      styleBorder(251, 252);
      styleBorder(271, 272);
      styleBorder(281, 282);
      styleBorder(291, 292);
      styleBorder(311, 312);
      styleBorder(321, 322);
    } else if (noOfTeamsValue == 43) {
      styleBorder(11, 12);
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(71, 72);
      styleBorder(81, 82);
      styleBorder(91, 92);
      styleBorder(121, 122);
      styleBorder(131, 132);
      styleBorder(151, 152);
      styleBorder(161, 162);
      styleBorder(171, 172);
      styleBorder(201, 202);
      styleBorder(211, 212);
      styleBorder(231, 232);
      styleBorder(241, 242);
      styleBorder(251, 252);
      styleBorder(271, 272);
      styleBorder(281, 282);
      styleBorder(291, 292);
      styleBorder(311, 312);
      styleBorder(321, 322);
    } else if (noOfTeamsValue == 44) {
      styleBorder(11, 12);
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(71, 72);
      styleBorder(81, 82);
      styleBorder(91, 92);
      styleBorder(121, 122);
      styleBorder(131, 132);
      styleBorder(151, 152);
      styleBorder(161, 162);
      styleBorder(171, 172);
      styleBorder(201, 202);
      styleBorder(211, 212);
      styleBorder(231, 232);
      styleBorder(241, 242);
      styleBorder(251, 252);
      styleBorder(281, 282);
      styleBorder(291, 292);
      styleBorder(311, 312);
      styleBorder(321, 322);
    } else if (noOfTeamsValue == 45) {
      styleBorder(11, 12);
      styleBorder(31, 32);
      styleBorder(51, 52);
      styleBorder(71, 72);
      styleBorder(91, 92);
      styleBorder(121, 122);
      styleBorder(131, 132);
      styleBorder(151, 152);
      styleBorder(161, 162);
      styleBorder(171, 172);
      styleBorder(201, 202);
      styleBorder(211, 212);
      styleBorder(231, 232);
      styleBorder(241, 242);
      styleBorder(251, 252);
      styleBorder(281, 282);
      styleBorder(291, 292);
      styleBorder(311, 312);
      styleBorder(321, 322);
    } else if (noOfTeamsValue == 46) {
      styleBorder(11, 12);
      styleBorder(31, 32);
      styleBorder(51, 52);
      styleBorder(71, 72);
      styleBorder(91, 92);
      styleBorder(121, 122);
      styleBorder(131, 132);
      styleBorder(151, 152);
      styleBorder(161, 162);
      styleBorder(171, 172);
      styleBorder(191, 192);
      styleBorder(201, 202);
      styleBorder(211, 212);
      styleBorder(231, 232);
      styleBorder(241, 242);
      styleBorder(251, 252);
      styleBorder(281, 282);
      styleBorder(291, 292);
      styleBorder(311, 312);
      styleBorder(321, 322);
    } else if (noOfTeamsValue == 47) {
      styleBorder(11, 12);
      styleBorder(31, 32);
      styleBorder(51, 52);
      styleBorder(71, 72);
      styleBorder(91, 92);
      styleBorder(111, 112);
      styleBorder(131, 132);
      styleBorder(151, 152);
      styleBorder(171, 172);
      styleBorder(191, 192);
      styleBorder(211, 212);
      styleBorder(231, 232);
      styleBorder(251, 252);
      styleBorder(281, 282);
      styleBorder(291, 292);
      styleBorder(311, 312);
      styleBorder(321, 322);
    } else if (noOfTeamsValue == 48) {
      let number1 = 11, number2 = 12
      while (number1 <= 311) {
        styleBorder(number1, number2);
        number1 += 20;
        number2 += 20;
      }
    } else if (noOfTeamsValue == 49) {
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(81, 82);
      styleBorder(91, 92);
      styleBorder(111, 112);
      styleBorder(131, 132);
      styleBorder(151, 152);
      styleBorder(171, 172);
      styleBorder(191, 192);
      styleBorder(211, 212);
      styleBorder(231, 232);
      styleBorder(251, 252);
      styleBorder(271, 272);
      styleBorder(291, 292);
      styleBorder(311, 312);
    } else if (noOfTeamsValue == 50) {
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(81, 82);
      styleBorder(91, 92);
      styleBorder(111, 112);
      styleBorder(131, 132);
      styleBorder(151, 152);
      styleBorder(201, 202);
      styleBorder(211, 212);
      styleBorder(241, 242);
      styleBorder(251, 252);
      styleBorder(271, 272);
      styleBorder(291, 292);
      styleBorder(311, 312);
    } else if (noOfTeamsValue == 51) {
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(81, 82);
      styleBorder(121, 122);
      styleBorder(131, 132);
      styleBorder(161, 162);
      styleBorder(201, 202);
      styleBorder(211, 212);
      styleBorder(241, 242);
      styleBorder(251, 252);
      styleBorder(271, 272);
      styleBorder(291, 292);
      styleBorder(311, 312);
    } else if (noOfTeamsValue == 52) {
      styleBorder(41, 42);
      styleBorder(51, 52);
      styleBorder(81, 82);
      styleBorder(121, 122);
      styleBorder(131, 132);
      styleBorder(161, 162);
      styleBorder(201, 202);
      styleBorder(211, 212);
      styleBorder(241, 242);
      styleBorder(281, 282);
      styleBorder(291, 292);
      styleBorder(321, 322);
    } else if (noOfTeamsValue == 53) {
      styleBorder(11, 12);
      styleBorder(81, 82);
      styleBorder(91, 92);
      styleBorder(131, 132);
      styleBorder(161, 162);
      styleBorder(201, 202);
      styleBorder(211, 212);
      styleBorder(241, 242);
      styleBorder(281, 282);
      styleBorder(291, 292);
      styleBorder(321, 322);
    } else if (noOfTeamsValue == 54) {
      styleBorder(11, 12);
      styleBorder(81, 82);
      styleBorder(91, 92);
      styleBorder(131, 132);
      styleBorder(161, 162);
      styleBorder(171, 172);
      styleBorder(241, 242);
      styleBorder(251, 252);
      styleBorder(291, 292);
      styleBorder(321, 322);
    } else if (noOfTeamsValue == 55) {
      styleBorder(11, 12);
      styleBorder(51, 52);
      styleBorder(91, 92);
      styleBorder(131, 132);
      styleBorder(171, 172);
      styleBorder(241, 242);
      styleBorder(251, 252);
      styleBorder(291, 292);
      styleBorder(321, 322);
    } else if (noOfTeamsValue == 56) {
      styleBorder(11, 12);
      styleBorder(51, 52);
      styleBorder(91, 92);
      styleBorder(131, 132);
      styleBorder(171, 172);
      styleBorder(211, 212);
      styleBorder(251, 252);
      styleBorder(291, 292);
    } else if (noOfTeamsValue == 57) {
      styleBorder(11, 12);
      styleBorder(91, 92);
      styleBorder(131, 132);
      styleBorder(171, 172);
      styleBorder(211, 212);
      styleBorder(251, 252);
      styleBorder(291, 292);
    } else if (noOfTeamsValue == 58) {
      styleBorder(11, 12);
      styleBorder(91, 92);
      styleBorder(131, 132);
      styleBorder(171, 172);
      styleBorder(251, 252);
      styleBorder(291, 292);
    } else if (noOfTeamsValue == 59) {
      styleBorder(81, 82);
      styleBorder(161, 162);
      styleBorder(171, 172);
      styleBorder(251, 252);
      styleBorder(291, 292);
    } else if (noOfTeamsValue == 60) {
      styleBorder(81, 82);
      styleBorder(161, 162);
      styleBorder(241, 242);
      styleBorder(321, 322);
    } else if (noOfTeamsValue == 61) {
      styleBorder(161, 162);
      styleBorder(241, 242);
      styleBorder(321, 322);
    } else if (noOfTeamsValue == 62) {
      styleBorder(161, 162);
      styleBorder(321, 322);
    } else if (noOfTeamsValue == 63) {
      styleBorder(321, 322)
    }
  }
}

// Displaying the selected img file.
var _URL = window.URL || window.webkitURL;
let uploadImg = () => {
  $("#tournamentHeader").empty();
  let instName = document.getElementById("instName").value;
  $("#tournamentHeader").append(`
    <div id="logo-wrapper"></div>
    <h2 class="text-uppercase">${instName}</h2>
  `);

  var file;
  var image;
  if ((file = $("#instLogo")[0].files[0])) {
    image = new Image();
    image.onload = function () {
      $("#logo-wrapper").append(this);
      $(this).attr("id", "image");
    }
    image.src = _URL.createObjectURL(file);
  }
}

// function printDiv (divName) {
//   var printContents = document.getElementById(divName).innerHTML;
//   var originalContents = document.body.innerHTML;
//   document.body.innerHTML = printContents;
//   window.print();
//   document.body.innerHTML = originalContents;
// }

function generatePDF() {
  // Choose the element that our invoice is rendered in.
  const element = document.getElementById("tournamentContainer");
  // Properties for the PDF.
  let opt = {
    margin: 1,
    filename: 'Brackets.pdf',
    // image:        { type: 'jpeg', quality: 0.98 },
    // html2canvas:  { scale: 2 },
    jsPDF: { unit: 'in', format: 'A0', orientation: 'portrait' }
  };
  // Choose the element and save the PDF for our user.
  html2pdf()
    .set(opt)
    .from(element)
    .save();
}

/*Scroll to top when arrow up clicked BEGIN*/
$(window).scroll(function () {
  var height = $(window).scrollTop();
  if (height > 1000) {
    $('#back2Top').fadeIn();
  } else {
    $('#back2Top').fadeOut();
  }
});
$(document).ready(function () {
  $("#back2Top").click(function (event) {
    event.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, "slow");
    return false;
  });

});
/*Scroll to top when arrow up clicked END*/

// var generatePDF = function generatePDF(e) {
//   // e.preventDefault();

//   var specialElementHandler = {
//     "#editor": function (element, renderer) {
//       return true;
//     }
//   }

//   var doc = new jsPDF();
//   doc.fromHTML($("#tournamentHeader").html(), 15, 15, {
//     "width": 170,
//     "elementHandlers": specialElementHandler
//   });
//   // var stats = document.getElementById("container2");
//   // var table1 = doc.autoTableHtmlToJson(stats);
//   // var stats1 = document.getElementById("stats-table1");
//   // var table2 = doc.autoTableHtmlToJson(stats1);
//   // var staggers = document.getElementById("staggers");
//   // var table3 = doc.autoTableHtmlToJson(staggers);

//   // doc.setFontSize(12);
//   // doc.setTextColor(179, 46, 49);
//   // doc.text(105, 20, "VISWANATH - Track Marking Software", null, null, 'center');
//   // doc.text(105, 30, "Track measurement", null, null, 'center');
//   // doc.text("Credits : IAAF", 0.5, 5);
//   // doc.text(105, 40, "200 m Statistics", null, null, 'center');
//   // doc.text(5, 50, "NAME : " + name2, null, null);
//   // doc.text(200, 50, "Institute/Organization :" + univ2, null, null, 'right');
//   // doc.setFontSize(12);
//   // doc.addImage(imgData, 'JPEG', 15, 60, 180, 80);

//   // var cols = ["Total Length", "Total Width", "Total Area"];
//   // var data = [[tl, tw, ta]];
//   // doc.autoTable(cols, data, { startY: 150 });
//   // doc.autoTable(table1.columns, table1.data, {
//   //   startY: doc.autoTable.previous.finalY + 10,
//   //   pageBreak: 'avoid',
//   // });
//   // let first = doc.autoTable.previous;

//   // doc.setPage(1 + doc.internal.getCurrentPageInfo().pageNumber - doc.autoTable.previous.pageCount);

//   // doc.autoTable(table2.columns, table2.data, {
//   //   startY: doc.autoTable.previous.finalY + 10,
//   //   pageBreak: 'avoid',
//   // });
//   // // doc.addImage(imgData1, 'PNG', 0, 0, 50, 50);
//   // doc.autoTable(table3.columns, table3.data, {
//   //   startY: doc.autoTable.previous.finalY + 10,
//   //   margin: { top: 40 },
//   //   pageBreak: 'avoid',
//   //   styles: { overflow: 'linebreak', columnWidth: 'wrap' },
//   //   columnStyles: { text: { columnWidth: '100%' } }
//   // });
//   // doc.setTextColor(179, 46, 49);
//   // doc.text("Credits : IAAF", 0.5, 5);

//   doc.save("bracketTest.pdf");
//   // return doc;
// };

// $("#saveBtn").on("click", generatePDF);