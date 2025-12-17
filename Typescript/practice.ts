let myName: string = 'Mun';
let maAge: number = 25;
let isStudent: boolean = false;

let members: string[] = ['Mun', 'Yu', "Lee"];

let memberDetail: [string, number] = ['Mun', 25];

let project: {
  name: string;
  days: number;
  started: boolean;
} = {
  name: 'Typescript Study',
  days: 30,
  started: true,
}

let unionMember: string | number = 123;
unionMember = 'Mun';

let mixedArray: (string | number)[] = [1, "2", 3];

function addNumber(x: number, y: number): number {
  return x + y;
};

function logging(msg: string): void {
  console.log(msg);
}

type MyId = string | number;

let userId: MyId = '123';
let userIndex: MyId = 123;

type UserInfo = {
  name: string;
  email: string;
  phone?: string;
}

let user1: UserInfo = {
  name: "Hong",
  email: `hong@test.com`
};

interface Student {
  studentId: number;
  name: string;
  grade: number;
};

interface HighSchoolStudent extends Student {
  classRoom: string;
};

let student1: HighSchoolStudent = {
  studentId: 202301,
  name: 'Lee',
  grade: 1,
  classRoom: 'A-1',
};

type AddFunc = (a: number, b: number)=> number;

const myAdd: AddFunc = (a, b)=>{
  return a + b;
}