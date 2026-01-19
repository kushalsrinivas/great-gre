// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconSymbolName = 
  | "house.fill"
  | "chevron.left"
  | "chevron.right"
  | "chevron.left.forwardslash.chevron.right"
  | "chart.bar"
  | "chart.bar.fill"
  | "arrow.clockwise"
  | "arrow.up.right"
  | "arrow.down.right"
  | "arrow.right"
  | "paperplane.fill"
  | "magnifyingglass"
  | "exclamationmark.magnifyingglass"
  | "gearshape.fill"
  | "list.bullet"
  | "book.fill"
  | "books.vertical.fill"
  | "clipboard"
  | "clipboard.fill"
  | "list.clipboard.fill"
  | "person.fill"
  | "star.fill"
  | "checkmark"
  | "checkmark.circle.fill"
  | "xmark"
  | "xmark.circle.fill"
  | "questionmark.circle.fill"
  | "exclamationmark.triangle.fill"
  | "info.circle.fill"
  | "graduationcap.fill"
  | "flame.fill"
  | "diamond.fill"
  | "target"
  | "bolt.fill"
  | "trophy.fill"
  | "lightbulb.fill"
  | "clock.fill"
  | "calendar.fill"
  | "bell.fill"
  | "bookmark.fill"
  | "bookmark"
  | "pin.fill"
  | "speaker.wave.2.fill"
  | "party.popper.fill"
  | "moon.fill"
  | "cloud.fill"
  | "leaf.fill"
  | "tortoise.fill"
  | "brain.head.profile"
  | "dumbbell.fill"
  | "wifi.slash"
  | "cpu"
  | "lock.fill"
  | "circle.fill"
  | "rectangle.stack.fill"
  | "trash.fill"
  | "plus.circle.fill"
  | "chart.line.uptrend.xyaxis"
  | "sparkles"
  | "pencil"
  | "hand.thumbsup.fill";

type IconMapping = Record<IconSymbolName, ComponentProps<typeof MaterialIcons>["name"]>;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Navigation
  "house.fill": "home",
  "chevron.left": "chevron-left",
  "chevron.right": "chevron-right",
  "chevron.left.forwardslash.chevron.right": "code",
  "chart.bar": "bar-chart",
  "chart.bar.fill": "bar-chart",
  "arrow.clockwise": "refresh",
  "arrow.up.right": "trending-up",
  "arrow.down.right": "trending-down",
  "arrow.right": "arrow-forward",
  
  // Actions
  "paperplane.fill": "send",
  "magnifyingglass": "search",
  "exclamationmark.magnifyingglass": "search-off",
  "gearshape.fill": "settings",

  // Content
  "list.bullet": "list",
  "book.fill": "menu-book",
  "books.vertical.fill": "library-books",
  "clipboard": "assignment",
  "clipboard.fill": "assignment",
  "list.clipboard.fill": "assignment",

  // Status & Indicators
  "person.fill": "person",
  "star.fill": "star",
  "checkmark": "check",
  "checkmark.circle.fill": "check-circle",
  "xmark": "close",
  "xmark.circle.fill": "cancel",
  "questionmark.circle.fill": "help",
  "exclamationmark.triangle.fill": "warning",
  "info.circle.fill": "info",
  
  // Learning & Education
  "graduationcap.fill": "school",
  "flame.fill": "local-fire-department",
  "diamond.fill": "diamond",
  "target": "adjust",
  "bolt.fill": "flash-on",
  "trophy.fill": "emoji-events",
  "lightbulb.fill": "lightbulb",
  
  // Time & Calendar
  "clock.fill": "access-time",
  "calendar.fill": "event",
  
  // Communication
  "bell.fill": "notifications",
  "bookmark.fill": "bookmark",
  "bookmark": "bookmark-border",
  "pin.fill": "push-pin",
  
  // Media
  "speaker.wave.2.fill": "volume-up",
  "party.popper.fill": "celebration",
  
  // Nature & Weather
  "moon.fill": "nightlight",
  "cloud.fill": "cloud",
  "leaf.fill": "eco",
  
  // Animals & Objects
  "tortoise.fill": "pets",
  "brain.head.profile": "psychology",
  "dumbbell.fill": "fitness-center",
  
  // Tech & Network
  "wifi.slash": "wifi-off",
  "cpu": "memory",
  "lock.fill": "lock",
  
  // Shapes & Symbols
  "circle.fill": "circle",
  "rectangle.stack.fill": "layers",
  "trash.fill": "delete",
  "plus.circle.fill": "add-circle",
  
  // Charts & Analytics
  "chart.line.uptrend.xyaxis": "trending-up",
  "sparkles": "auto-awesome",
  "pencil": "edit",
  "hand.thumbsup.fill": "thumb-up",
};

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name] as ComponentProps<typeof MaterialIcons>["name"]}
      style={style}
    />
  );
}
