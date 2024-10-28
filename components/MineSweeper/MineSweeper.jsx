import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, TouchableOpacity, Alert, Pressable } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { styles } from "./MineSweeper.style";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";

// Helper function to create the board
const createBoard = (rows, cols, mines) => {
  let board = [];
  let mineArray = Array(mines).fill("M");
  let emptyArray = Array(rows * cols - mines).fill(0);
  let combinedArray = mineArray.concat(emptyArray);
  combinedArray = combinedArray.sort(() => Math.random() - 0.5);

  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < cols; j++) {
      row.push({
        value: combinedArray[i * cols + j],
        revealed: false,
        flagged: false,
        x: i,
        y: j,
      });
    }
    board.push(row);
  }

  // Calculate adjacent mines for each empty cell
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (board[i][j].value === "M") continue;
      let mineCount = 0;
      const directions = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ];

      directions.forEach(([dx, dy]) => {
        const newX = i + dx;
        const newY = j + dy;
        if (
          newX >= 0 &&
          newX < rows &&
          newY >= 0 &&
          newY < cols &&
          board[newX][newY].value === "M"
        ) {
          mineCount++;
        }
      });

      board[i][j].value = mineCount;
    }
  }

  return board;
};

const Minesweeper = () => {
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [open, setOpen] = useState(false);
  const [levelValue, setLevelValue] = useState("easy");
  let [rows, setRows] = useState(10);
  let [cols, setCols] = useState(8);
  let [mines, setMines] = useState(10);
  const [items, setItems] = useState([
    { label: "Asan", value: "easy" },
    { label: "Orta", value: "middle" },
    { label: "Çətin", value: "hard" },
  ]);
  const shakeTranslateX = useSharedValue(0);

  const bombRef = useRef(null);

  useEffect(() => {
    bombRef?.current?.play(0, 1);
  }, []);

  const handleBomb = () => {
    bombRef?.current?.play(1, 240);
  };

  const shake = useCallback(() => {
    const TranslationAmount = 13;
    const timingConfig = {
      duration: 80,
    };
    shakeTranslateX.value = withSequence(
      withTiming(TranslationAmount, timingConfig),
      withRepeat(withTiming(-TranslationAmount, timingConfig), 1, true),
      withTiming(0, {
        mass: 0.5,
      })
    );
  }, []);

  const rShakeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeTranslateX.value }],
    };
  }, []);

  useEffect(() => {
    setBoard(createBoard(rows, cols, mines));
  }, []);

  useEffect(() => {
    if (levelValue === "easy") {
      setRows(10);
      setCols(8);
      setMines(10);
      // createBoard(rows, cols, mines);
      setBoard(createBoard(10, 8, 10));
      setGameOver(false);
    } else if (levelValue === "middle") {
      setRows(18);
      setCols(14);
      setMines(40);
      // createBoard(rows, cols, mines);
      setBoard(createBoard(18, 14, 40));
      setGameOver(false);
    } else {
      setRows(24);
      setCols(20);
      setMines(99);
      // createBoard(rows, cols, mines);
      setBoard(createBoard(24, 20, 99));
      setGameOver(false);
    }
  }, [levelValue]);

  const revealCell = (x, y) => {
    if (gameOver || board[x][y].revealed) return;

    let newBoard = [...board];

    if (newBoard[x][y].flagged) {
      newBoard[x][y].flagged = false;
    }

    newBoard[x][y].revealed = true;

    if (newBoard[x][y].value === "M") {
      // Alert.alert("Game Over", "You hit a mine!");
      shake();
      revealAllBombs(newBoard);
      setGameOver(true);
      setBoard(newBoard);
      return;
    }

    // Reveal adjacent empty cells if value is 0
    if (newBoard[x][y].value === 0) {
      revealAdjacentEmptyCells(newBoard, x, y);
    }

    setBoard(newBoard);

    // Check for win
    if (checkWin(newBoard)) {
      Alert.alert("You Win!", "Congratulations, you cleared the board!");
      setGameOver(true);
    }
  };

  const revealAdjacentEmptyCells = (board, x, y) => {
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    directions.forEach(([dx, dy]) => {
      const newX = x + dx;
      const newY = y + dy;
      if (
        newX >= 0 &&
        newX < rows &&
        newY >= 0 &&
        newY < cols &&
        !board[newX][newY].revealed &&
        board[newX][newY].value !== "M"
      ) {
        board[newX][newY].revealed = true;
        if (board[newX][newY].flagged) {
          board[newX][newY].flagged = false;
        }
        if (board[newX][newY].value === 0) {
          revealAdjacentEmptyCells(board, newX, newY);
        }
      }
    });
  };

  const checkWin = (board) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (!board[i][j].revealed && board[i][j].value !== "M") {
          return false;
        }
      }
    }
    return true;
  };

  const resetGame = () => {
    setBoard(createBoard(rows, cols, mines));
    setGameOver(false);
  };

  const handleFlag = (x, y) => {
    if (gameOver || board[x][y].revealed) return;

    let newBoard = [...board];
    newBoard[x][y].flagged = !newBoard[x][y].flagged; // Toggle flag state
    setBoard(newBoard);
  };

  const revealAllBombs = (newBoard) => {
    // Iterate over the board and reveal all bombs
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (newBoard[i][j].value === "M") {
          newBoard[i][j].revealed = true;
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <DropDownPicker
          open={open}
          value={levelValue}
          items={items}
          setOpen={setOpen}
          setValue={setLevelValue}
          setItems={setItems}
          style={styles.dropDown}
          containerStyle={styles.dropDownContainer}
          dropDownContainerStyle={styles.dropDownItems}
        />
        <Text>{mines} 💣</Text>
        <TouchableOpacity title="Restart" onPress={resetGame}>
          <MaterialIcons name="restart-alt" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {board.map((row, i) => (
        <Animated.View key={i} style={[styles.row, rShakeStyle]}>
          {row.map((cell, j) => (
            <TouchableOpacity
              key={j}
              style={[
                styles.cell,
                cell.revealed &&
                  (cell.value === "M" ? styles.mine : styles.revealed),
                (j % 2 === 0 && i % 2 === 0) || (j % 2 !== 0 && i % 2 !== 0)
                  ? styles.evenCell
                  : styles.oddCell,
                cell.revealed &&
                  (cell.value === "M" ? styles.bombedCell : styles.openedCell),
              ]}
              onPress={() => revealCell(i, j)}
              onLongPress={() => handleFlag(i, j)}
            >
              <Text
                style={[
                  styles.cellText,
                  {
                    color:
                      cell.value === 1
                        ? "blue"
                        : cell.value === 2
                        ? "red"
                        : cell.value === 3
                        ? "green"
                        : "purple",
                  },
                ]}
              >
                {cell.flagged
                  ? "🚩"
                  : cell.revealed && cell.value === "M"
                  ? "💣"
                  : cell.revealed && cell.value !== 0
                  ? cell.value
                  : ""}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      ))}
    </View>
  );
};

export default Minesweeper;
