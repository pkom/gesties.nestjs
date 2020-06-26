import * as clear from 'clear';
import * as cliProgress from 'cli-progress';
import * as Command from 'commander';

import { Events, Rayuela } from '../common/rayuela/importers/rayuela';

const multibar = new cliProgress.MultiBar(
  {
    clearOnComplete: false,
    hideCursor: true,
    format:
      'progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} | Entity: {description}',
    emptyOnZero: true,
  },
  cliProgress.Presets.shades_grey,
);

let barStudents: cliProgress.SingleBar;
let barTeachers: cliProgress.SingleBar;
let barGroups: cliProgress.SingleBar;
let barDepartments: cliProgress.SingleBar;
let barAdditional: cliProgress.SingleBar;
let barParents: cliProgress.SingleBar;

function onStartStudents(totalStudents) {
  barStudents = multibar.create(totalStudents, 0, { description: 'Students' });
}
function onStopStudents() {
  barStudents.stop();
}
function onProcessedStudent() {
  barStudents.increment();
}

function onStartTeachers(totalTeachers) {
  barTeachers = multibar.create(totalTeachers, 0, { description: 'Teachers' });
}
function onStopTeachers() {
  barTeachers.stop();
}
function onProcessedTeacher() {
  barTeachers.increment();
}

function onStartGroups(totalGroups) {
  barGroups = multibar.create(totalGroups, 0, { description: 'Groups' });
}
function onStopGroups() {
  barGroups.stop();
}
function onProcessedGroup() {
  barGroups.increment();
}

function onStartDepartments(totalDepartments) {
  barDepartments = multibar.create(totalDepartments, 0, {
    description: 'Departments',
  });
}
function onStopDepartments() {
  barDepartments.stop();
}
function onProcessedDepartment() {
  barDepartments.increment();
}

function onStartAdditional(totalAdditional) {
  barAdditional = multibar.create(totalAdditional, 0, {
    description: 'Students Additional Data',
  });
}
function onStopAdditional() {
  barAdditional.stop();
}
function onProcessedAdditional() {
  barAdditional.increment();
}

function onStartParents(totalParents) {
  barParents = multibar.create(totalParents, 0, {
    description: 'Parents',
  });
}
function onStopParents() {
  barParents.stop();
}
function onProcessedParent() {
  barParents.increment();
}

async function run() {
  const program = new Command.Command();
  program.version('0.0.1');
  program
    .requiredOption(
      '-c, --course <course>',
      'course must be defined: 20xy/20xy',
    )
    .option('--geo', 'activate address geocoding', false)
    .option(
      '-s, --students-zip-file <studentsZipFile>',
      'path to rayuela students zip file',
    )
    .option(
      '-t, --teachers-xml-file <teachersXmlFile>',
      'path to rayuela teachers xml file',
    )
    .option(
      '-g, --groups-xml-file <groupsXmlFile>',
      'path to rayuela tutors groups xml file',
    )
    .option(
      '-a, --students-additional-data-xls-file <studentsAdditionalDataXlsFile>',
      'path to rayuela students additional data xls file',
    )
    .option(
      '-p, --parents-data-xls-file <parentsDataXlsFile>',
      'path to rayuela students parents data xls file',
    );

  program.parse(process.argv);
  const rayuela = new Rayuela(program.opts());
  clear();
  console.log('Processing rayuela data files...');
  rayuela.on(Events.STUDENTS_STARTED, onStartStudents);
  rayuela.on(Events.STUDENTS_FINISHED, onStopStudents);
  rayuela.on(Events.STUDENT_PROCESSED, onProcessedStudent);
  rayuela.on(Events.TEACHERS_STARTED, onStartTeachers);
  rayuela.on(Events.TEACHERS_FINISHED, onStopTeachers);
  rayuela.on(Events.TEACHER_PROCESSED, onProcessedTeacher);
  rayuela.on(Events.GROUPS_STARTED, onStartGroups);
  rayuela.on(Events.GROUPS_FINISHED, onStopGroups);
  rayuela.on(Events.GROUP_PROCESSED, onProcessedGroup);
  rayuela.on(Events.DEPARTMENTS_STARTED, onStartDepartments);
  rayuela.on(Events.DEPARTMENTS_FINISHED, onStopDepartments);
  rayuela.on(Events.DEPARTMENT_PROCESSED, onProcessedDepartment);
  rayuela.on(Events.ADDITIONALS_STARTED, onStartAdditional);
  rayuela.on(Events.ADDITIONALS_FINISHED, onStopAdditional);
  rayuela.on(Events.ADDITIONAL_PROCESSED, onProcessedAdditional);
  rayuela.on(Events.PARENTS_STARTED, onStartParents);
  rayuela.on(Events.PARENTS_FINISHED, onStopParents);
  rayuela.on(Events.PARENT_PROCESSED, onProcessedParent);

  await rayuela.process();
}

run()
  .then(() => {
    multibar.stop();
    process.exit(0);
  })
  .catch(err => {
    multibar.stop();
    console.log(err);
    process.exit(1);
  });
