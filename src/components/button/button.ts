import { Component } from "../../services/component";
type Props = Record<string, unknown>;

class Button extends Component {
    constructor(props: Props) {
          // Создаём враппер дом-элемент button
      super("button", props);
    }
  
    render() {
          // В проект должен быть ваш собственный шаблонизатор
      return `<div>${this.props.text}</div>`;
    }
  }
  
  function render(query: string, block: Component) {
    const root = document.querySelector(query);
    if (!root) {
      throw new Error(`Element with selector "${query}" not found`);
    }
    const content = block.getContent();
    
    if (!content) {
      throw new Error("Block content is null or undefined");
    }
  
    root.appendChild(content);
    return root as HTMLElement;
  }
  
  const button = new Button({
          text: 'Click me',
  });
  
  // app — это class дива в корне DOM
  render(".app", button);
  
  // Через секунду контент изменится сам, достаточно обновить пропсы
  setTimeout(() => {
    button.setProps({
      text: 'Click me, please',
    });
  }, 1000);
