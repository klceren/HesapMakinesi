import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Vibration,
} from 'react-native';

type Operator = '+' | '-' | null;

export default function App() {
  const [current, setCurrent] = useState('0');
  const [firstNum, setFirstNum] = useState<string | null>(null);
  const [op, setOp] = useState<Operator>(null);
  const [expression, setExpression] = useState('');
  const [justCalc, setJustCalc] = useState(false);

  const formatNum = (val: string) => {
    const parts = val.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join(',');
  };

  const press = (btn: string) => {
    Vibration.vibrate(30);

    if (btn === 'C') {
      setCurrent('0');
      setFirstNum(null);
      setOp(null);
      setExpression('');
      setJustCalc(false);
      return;
    }

    if (btn === '⌫') {
      if (justCalc) { setCurrent('0'); setJustCalc(false); return; }
      setCurrent(c => c.length > 1 ? c.slice(0, -1) : '0');
      return;
    }

    if (btn === '±') {
      setCurrent(c => String(parseFloat(c) * -1));
      return;
    }

    if (btn === '.') {
      if (justCalc) { setCurrent('0,'); setJustCalc(false); return; }
      setCurrent(c => c.includes(',') ? c : c + ',');
      return;
    }

    if (btn === '+' || btn === '-') {
      const normalCurrent = current.replace(',', '.');
      if (op && !justCalc && firstNum) {
        const a = parseFloat(firstNum);
        const b = parseFloat(normalCurrent);
        const res = op === '+' ? a + b : a - b;
        const resStr = String(parseFloat(res.toFixed(10)));
        setCurrent(resStr.replace('.', ','));
        setFirstNum(resStr);
        setExpression(formatNum(resStr) + ' ' + btn);
      } else {
        setFirstNum(normalCurrent);
        setExpression(formatNum(current) + ' ' + btn);
      }
      setOp(btn);
      setJustCalc(false);
      return;
    }

    if (btn === '=') {
      if (!op || !firstNum) return;
      const a = parseFloat(firstNum);
      const b = parseFloat(current.replace(',', '.'));
      const res = op === '+' ? a + b : a - b;
      const resStr = String(parseFloat(res.toFixed(10)));
      setExpression(formatNum(firstNum.replace('.', ',')) + ' ' + op + ' ' + formatNum(current) + ' =');
      setCurrent(resStr.replace('.', ','));
      setFirstNum(null);
      setOp(null);
      setJustCalc(true);
      return;
    }

    // Sayılar
    if (justCalc) {
      setCurrent(btn);
      setJustCalc(false);
    } else {
      setCurrent(c => c === '0' ? btn : c + btn);
    }
  };

  const buttons: (string | { label: string; span?: number; type: 'op' | 'action' | 'equal' | 'num' })[][] = [
    [
      { label: 'C', span: 2, type: 'action' },
      { label: '⌫', type: 'action' },
      { label: '+', type: 'op' },
    ],
    [
      { label: '7', type: 'num' },
      { label: '8', type: 'num' },
      { label: '9', type: 'num' },
      { label: '-', type: 'op' },
    ],
    [
      { label: '4', type: 'num' },
      { label: '5', type: 'num' },
      { label: '6', type: 'num' },
      { label: '=', span: 1, type: 'equal' },
    ],
    [
      { label: '1', type: 'num' },
      { label: '2', type: 'num' },
      { label: '3', type: 'num' },
    ],
    [
      { label: '±', type: 'num' },
      { label: '0', type: 'num' },
      { label: '.', type: 'num' },
    ],
  ];

  const getButtonStyle = (type: string, label: string) => {
    if (type === 'equal') return [styles.btn, styles.btnEqual];
    if (type === 'action') return [styles.btn, styles.btnAction];
    if (type === 'op') return [
      styles.btn,
      styles.btnOp,
      op === label && !justCalc ? styles.btnOpActive : null,
    ];
    return [styles.btn, styles.btnNum];
  };

  const getTextStyle = (type: string) => {
    if (type === 'equal') return [styles.btnText, styles.btnTextEqual];
    if (type === 'action') return [styles.btnText, styles.btnTextAction];
    if (type === 'op') return [styles.btnText, styles.btnTextOp];
    return [styles.btnText, styles.btnTextNum];
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <View style={styles.container}>

        {/* Ekran */}
        <View style={styles.display}>
          <Text style={styles.expression} numberOfLines={1}>{expression || ' '}</Text>
          <Text style={styles.currentText} numberOfLines={1} adjustsFontSizeToFit>
            {formatNum(current)}
          </Text>
        </View>

        {/* Tuşlar */}
        <View style={styles.pad}>
          {/* Satır 1: C (geniş), ⌫, + */}
          <View style={styles.row}>
            <TouchableOpacity style={[styles.btn, styles.btnAction, styles.btnWide]} onPress={() => press('C')} activeOpacity={0.7}>
              <Text style={[styles.btnText, styles.btnTextAction]}>Sil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnAction]} onPress={() => press('⌫')} activeOpacity={0.7}>
              <Text style={[styles.btnText, styles.btnTextAction]}>⌫</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnOp, op === '+' && !justCalc ? styles.btnOpActive : null]} onPress={() => press('+')} activeOpacity={0.7}>
              <Text style={[styles.btnText, styles.btnTextOp]}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Satır 2: 7 8 9 - */}
          <View style={styles.row}>
            {['7','8','9'].map(n => (
              <TouchableOpacity key={n} style={[styles.btn, styles.btnNum]} onPress={() => press(n)} activeOpacity={0.7}>
                <Text style={[styles.btnText, styles.btnTextNum]}>{n}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.btn, styles.btnOp, op === '-' && !justCalc ? styles.btnOpActive : null]} onPress={() => press('-')} activeOpacity={0.7}>
              <Text style={[styles.btnText, styles.btnTextOp]}>−</Text>
            </TouchableOpacity>
          </View>

          {/* Satır 3: 4 5 6 | = (2 satır boyunca) */}
          <View style={styles.row}>
            {['4','5','6'].map(n => (
              <TouchableOpacity key={n} style={[styles.btn, styles.btnNum]} onPress={() => press(n)} activeOpacity={0.7}>
                <Text style={[styles.btnText, styles.btnTextNum]}>{n}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[styles.btn, styles.btnEqual, styles.btnTall]} onPress={() => press('=')} activeOpacity={0.7}>
              <Text style={[styles.btnText, styles.btnTextEqual]}>=</Text>
            </TouchableOpacity>
          </View>

          {/* Satır 4: 1 2 3 */}
          <View style={styles.row}>
            {['1','2','3'].map(n => (
              <TouchableOpacity key={n} style={[styles.btn, styles.btnNum]} onPress={() => press(n)} activeOpacity={0.7}>
                <Text style={[styles.btnText, styles.btnTextNum]}>{n}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.btnPlaceholder} />
          </View>

          {/* Satır 5: ± 0 . */}
          <View style={styles.row}>
            {['±','0',','].map(n => (
              <TouchableOpacity key={n} style={[styles.btn, styles.btnNum]} onPress={() => press(n === ',' ? '.' : n)} activeOpacity={0.7}>
                <Text style={[styles.btnText, styles.btnTextNum]}>{n}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.btnPlaceholder} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const BTN_SIZE = 72;
const GAP = 12;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  display: {
    paddingVertical: 24,
    paddingHorizontal: 8,
    alignItems: 'flex-end',
  },
  expression: {
    fontSize: 18,
    color: '#8888aa',
    marginBottom: 8,
    minHeight: 24,
  },
  currentText: {
    fontSize: 56,
    fontWeight: '300',
    color: '#ffffff',
    minHeight: 68,
  },
  pad: {
    gap: GAP,
  },
  row: {
    flexDirection: 'row',
    gap: GAP,
    alignItems: 'flex-start',
  },
  btn: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: BTN_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnWide: {
    flex: 2,
    width: undefined,
    borderRadius: BTN_SIZE / 2,
  },
  btnTall: {
    height: BTN_SIZE * 2 + GAP,
  },
  btnPlaceholder: {
    width: BTN_SIZE,
    height: BTN_SIZE,
  },
  btnNum: {
    backgroundColor: '#2d2d44',
    flex: 1,
    width: undefined,
  },
  btnOp: {
    backgroundColor: '#3a3a5c',
    flex: 1,
    width: undefined,
  },
  btnOpActive: {
    backgroundColor: '#5c5caa',
  },
  btnAction: {
    backgroundColor: '#3d2d2d',
    flex: 1,
    width: undefined,
  },
  btnEqual: {
    backgroundColor: '#4a4aaa',
    flex: 1,
    width: undefined,
  },
  btnText: {
    fontSize: 22,
    fontWeight: '400',
  },
  btnTextNum: {
    color: '#ffffff',
  },
  btnTextOp: {
    color: '#aaaaff',
    fontSize: 26,
  },
  btnTextAction: {
    color: '#ff8888',
    fontSize: 18,
  },
  btnTextEqual: {
    color: '#ffffff',
    fontSize: 28,
  },
});
