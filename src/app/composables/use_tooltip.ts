import {
	type Ref,
	useTemplateRef,
	watch,
	onMounted,
	onBeforeUnmount,
} from "vue";
import { addNewError } from "@/errors/store";

export const useToolTip = (
	parent: ReturnType<typeof useTemplateRef<HTMLElement>>,
	toolTipText: Ref<string>,
	showCondition?: () => boolean,
) => {
	const app = document.getElementById("app")!;
	const toolTipEl = createTooltipEl();
	const duration = 150;
	const fill = "forwards";
	const translate = {
		from: "translate(-50%, calc(-80% - 0.75rem))",
		to: "translate(-50%, calc(-100% - 0.75rem))",
	};
	let removeTooltipTimeout: ReturnType<typeof setTimeout> | null = null;

	watch(toolTipText, (t) => {
		if (t) toolTipEl.textContent = t;
	});

	function appendToolTip() {
		if (removeTooltipTimeout) clearRemoveTooltipTimeout();

		const { left, top, width } = parent.value!.getBoundingClientRect();

		toolTipEl.style.setProperty("left", `${left + width / 2}px`);
		toolTipEl.style.setProperty("top", `${top}px`);

		app.appendChild(toolTipEl);

		toolTipEl.animate(
			{
				transform: [translate.from, translate.to],
				opacity: [0, 1],
			},
			{ duration, easing: "ease-out", fill },
		);
	}

	function removeToolTip() {
		toolTipEl.animate(
			{
				transform: [translate.to, translate.from],
				opacity: [1, 0],
			},
			{ duration, easing: "ease-in", fill },
		);

		removeTooltipTimeout = setTimeout(() => {
			app.removeChild(toolTipEl);
			clearRemoveTooltipTimeout();
		}, duration);
	}

	function moveToolTip(e: MouseEvent, options?: KeyframeAnimationOptions) {
		options = {
			duration,
			fill,
			...options,
		};

		const { left, right, bottom, top } = parent.value!.getBoundingClientRect();
		const { clientX, clientY } = e;

		const leftTranslate = `calc(${(clientX - left) / (right - left)} * 1rem)`;
		const topTranslate = `calc(${(clientY - top) / (bottom - top)} * 0.25rem)`;

		toolTipEl.animate(
			[{ translate: `${leftTranslate} ${topTranslate}` }],
			options,
		);
	}

	function clearRemoveTooltipTimeout() {
		if (!removeTooltipTimeout) return;

		clearTimeout(removeTooltipTimeout);
		removeTooltipTimeout = null;
	}

	// ==============================

	function onParentMouseEnter(e: MouseEvent) {
		if (showCondition && !showCondition()) return;

		appendToolTip();

		if (!removeTooltipTimeout) moveToolTip(e, { duration: 0 });

		window.addEventListener("mousemove", onWindowMouseMove);
	}

	function onParentMouseLeave() {
		removeToolTip();
		window.removeEventListener("mousemove", onWindowMouseMove);
	}

	function onWindowMouseMove(e: MouseEvent) {
		const { left, right, bottom, top } = parent.value!.getBoundingClientRect();
		const { clientX, clientY } = e;

		const mouseIsOverParent =
			clientX >= Math.floor(left) &&
			clientX <= Math.floor(right) &&
			clientY >= Math.floor(top) &&
			clientY <= Math.floor(bottom);

		if (!mouseIsOverParent) return onParentMouseLeave();

		moveToolTip(e);
	}

	function logParentIsUndefinedError() {
		addNewError({
			title: "ERROR SETTING UP TOOL TIP COMPOSABLE",
			desc: `parameter "parent" is undefined`,
		});
	}

	onMounted(() => {
		if (!parent.value) return logParentIsUndefinedError();

		parent.value.addEventListener("mouseenter", onParentMouseEnter);
	});

	onBeforeUnmount(() => {
		if (!parent.value) return logParentIsUndefinedError();

		parent.value.removeEventListener("mouseenter", onParentMouseEnter);
	});

	// ==============================

	function createTooltipEl() {
		const el = document.createElement("pre");

		el.id = "tooltip";
		el.textContent = toolTipText.value;
		el.classList.add(
			"ignore-default-boundaries",
			"pointer-events-none",
			"fixed",
			"-translate-x-1/2",
			"z-50",
			"rounded",
			"bg-stone-800",
			"px-2",
			"py-1",
			"font-[inherit]",
			"text-xs",
			"font-semibold",
			"text-stone-200",
		);

		return el;
	}
};
