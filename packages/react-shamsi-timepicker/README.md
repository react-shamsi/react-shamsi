## Jalali date picker

Let's start by displaying a very simple Jalali date picker using react-jalali. We do it by import the styles and the component itself like so:

```jsx
import { DatePicker } from "@react-shamsi/datepicker";
import "@react-shamsi/calendar/dist/styles.css";
import "@react-shamsi/datepicker/dist/styles.css";

export default function Example() {
  return <DatePicker />;
}
```

### Configuration

Now we are going to explore every single prop that could be passed to DatePicker.
| Prop name | Description | Default value
|--|--| --|
|autoUpdate|Automatically updates the input whenever the user changes the active date. This means that the confirm button won't be needed for saving the date anymore.| false|
|defaultDate| The date that will be displayed on the input by default| n/a |
|calendarProps| Every prop for configuring the calendar component| n/a|
|date| Changes the date in a controlled manner | n/a |
|dateFormat| The format that the date will be displayed in | "yyyy/MM/dd" |
|onChange|Function that gets called whenever the user selects a date. The new date will be passed as it's argument| n/a |
|persianDigits|Will convert the input's date to persian digits|false|
|...Input element props| Every other prop that can be passed to an input can be also passed to this component.| n/a |
