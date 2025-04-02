import { ref } from "vue";
import { v4 as uuid } from "uuid";

export type Error = {
	id: string;
	dateAdded: number;
	title: string;
	desc: string;
};

const errors = ref<Error[]>([]);

function addNewError(e: { title: Error["title"]; desc: Error["desc"] }) {
	errors.value.unshift({
		id: uuid(),
		dateAdded: new Date().getTime(),
		...e,
	});
}

function deleteError(id: Error["id"]) {
	const errorIndex = errors.value.findIndex((e) => e.id === id);

	if (errorIndex === -1) return;

	errors.value.splice(errorIndex, 1);
}

export { errors, addNewError, deleteError };
