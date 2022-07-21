export class Answer {
  title: string;
  value: number;

  constructor() {
    this.title = undefined;
    this.value = undefined;
  }

  setTitle(title: string) {
    this.title = title;
    return this;
  }

  setValue(value: number) {
    this.value = value;
    return this;
  }
}

export class Question {
  question_id: string;
  title: string;

  constructor() {
    this.question_id = undefined;
    this.title = undefined;
  }

  setQuestionId(question_id: string) {
    this.question_id = question_id;
    return this;
  }

  setTitle(title: string) {
    this.title = title;
    return this;
  }
}

export class Section {
  type: string;
  title: string;
  answers: Answer[];
  questions: Question[];

  constructor() {
    this.type = undefined;
    this.title = undefined;
    this.answers = [];
    this.questions = [];
  }

  setType(type: string) {
    this.type = type;
    return this;
  }

  setTitle(title: string) {
    this.title = title;
    return this;
  }

  setAnswers(answers: Answer[]) {
    this.answers = answers;
    return this;
  }

  setQuestions(questions: Question[]) {
    this.questions = questions;
    return this;
  }
}

export class Sections {
  sections: Section[];
  display_name: string;

  constructor() {
    this.sections = [];
    this.display_name = undefined;
  }

  setDisplayName(display_name: string) {
    this.display_name = display_name;
    return this;
  }

  setSections(sections: Section[]) {
    this.sections = sections;
    return this;
  }
}

export class DiagnosticScreenerBuilder {
  id: string;
  name: string;
  disorder: string;
  content: Sections;
  full_name: string;

  constructor() {
    this.id = undefined;
    this.name = undefined;
    this.disorder = undefined;
    this.content = undefined;
    this.full_name = undefined;
  }

  setId(id: string) {
    this.id = id;
    return this;
  }

  setName(name: string) {
    this.name = name;
    return this;
  }

  setDisorder(disorder: string) {
    this.disorder = disorder;
    return this;
  }

  setContent(content: Sections) {
    this.content = content;
    return this;
  }

  setFullName(full_name: string) {
    this.full_name = full_name;
    return this;
  }
}
