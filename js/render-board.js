let buckets = ["to-do", "in-progress", "await-feedback", "done"];

function generateCardHTML(id, title, description, category, categoryColor) {
    return `
            <div class="task-card" id="task_card_${id}" onclick="loadTaskOpen(${id})" ondragstart="startDragging(${id})"
            draggable="true">
            <div class="category-move-card-container">
                <div class="task-category-label" style="background-color: ${categoryColor};">${category}</div>
                <svg fill="#000000" width="1.6rem" height="1.6rem" viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg" class="mobile-move-card d-none"
                    onclick="switchToBucket(3, event)">
                    <path d="M4 14v2l-4-3 4-3v2h12v2H4zm8-12V0l4 3-4 3V4H0V2h12z"
                        fill-rule="evenodd"></path>
                </svg>
				<div class="mbl-move-btn-container">
					<button class="mbl-move-btn" onclick="doNotForward(event); showSubmenu('move_submenu${id}', 'd-none')" id="mbl_move${id}">Move</button>
					<div id="move_submenu${id}" class="mbl-move-menu d-none">
						<div class="mbl-move-item" onclick="doNotForward(event); startDragging(${id}); moveTo('to-do')">To Do</div>
						<div class="mbl-move-item" onclick="doNotForward(event); startDragging(${id}); moveTo('in-progress')">In progress</div>
						<div class="mbl-move-item" onclick="doNotForward(event); startDragging(${id}); moveTo('await-feedback')">Await feedback</div>
						<div class="mbl-move-item" onclick="doNotForward(event); startDragging(${id}); moveTo('done')">Done</div>
					</div>
				</div>

            </div>
            <!-- Title and Description -->
            <div class="task-title-and-description">
                <h4 class="task-title" title="${title}">${title}</h4>
                <div class="task-description">${description}</div>
            </div>
            <!-- Subtasks -->
            <div id="subtasks_container_${id}" class="subtasks-container">
            </div>

            <!-- Assignment -->
            <div class="task-assignment-prio-container">
                <div id="task_assignment_container_${id}" class="task-assignments"></div>
                <!-- Prio -->
                <div id="task_prio_img_${id}"></div>
            </div>

        </div>
    `;
}

function generateNoTaskHTML(bucket) {
    return `<div class="no-tasks">No tasks ${bucket}</div>`;
}

function generateSubtaskProgressHTML(allSubtask, done) {
    let percentInWidth = generatePercentInWidth(allSubtask, done);
    return `
        <div class="subtasks-progress-bar" title="${done}/${allSubtask} subtasks are done">
            <div class="progress" style="width: ${percentInWidth}%;"></div>
        </div>
        <div class="nowrap">${done}/${allSubtask} Subtasks</div>
    `;
}

function generateAssignedBadgeHTML(userBadge, badgeColor) {
    return `<div style="background-color: ${badgeColor};" class="profile-badge">${userBadge}</div>`;
}

function generateAssigmentBadgeEditTaskHTML(userBadge, badgeColor, i) {
    return `<div id="initials${i}" class="contact-badge" style="background-color: ${badgeColor};">${userBadge}</div>`;
}

function generateMediumPrioIcon() {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1.8rem" height="0.8rem" viewBox="0 0 18 8" fill="none">
        <g clip-path="url(#clip0_99462_2583)">
            <path d="M16.5685 7.16658L1.43151 7.16658C1.18446 7.16658 0.947523 7.06773 0.772832 6.89177C0.598141 6.71581 0.5 6.47716 0.5 6.22831C0.5 5.97947 0.598141 5.74081 0.772832 5.56485C0.947523 5.38889 1.18446 5.29004 1.43151 5.29004L16.5685 5.29004C16.8155 5.29004 17.0525 5.38889 17.2272 5.56485C17.4019 5.74081 17.5 5.97947 17.5 6.22831C17.5 6.47716 17.4019 6.71581 17.2272 6.89177C17.0525 7.06773 16.8155 7.16658 16.5685 7.16658Z" fill="#FFA800"/>
            <path d="M16.5685 2.7098L1.43151 2.7098C1.18446 2.7098 0.947523 2.61094 0.772832 2.43498C0.598141 2.25902 0.5 2.02037 0.5 1.77152C0.5 1.52268 0.598141 1.28403 0.772832 1.10807C0.947523 0.932105 1.18446 0.833252 1.43151 0.833252L16.5685 0.833252C16.8155 0.833252 17.0525 0.932105 17.2272 1.10807C17.4019 1.28403 17.5 1.52268 17.5 1.77152C17.5 2.02037 17.4019 2.25902 17.2272 2.43498C17.0525 2.61094 16.8155 2.7098 16.5685 2.7098Z" fill="#FFA800"/>
        </g>
        <defs>
            <clipPath id="clip0_99462_2583">
            <rect width="17" height="6.33333" fill="white" transform="translate(0.5 0.833252)"/>
            </clipPath>
        </defs>
    </svg>

    `;
}

function generateLowPrioIcon() {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1.8rem" height="1.2rem" viewBox="0 0 18 12" fill="none">
        <g clip-path="url(#clip0_99462_2611)">
            <path d="M8.99974 7.24524C8.80031 7.24557 8.60603 7.18367 8.44549 7.06863L0.876998 1.63467C0.778524 1.56391 0.695351 1.47498 0.632227 1.37296C0.569103 1.27094 0.527264 1.15784 0.5091 1.0401C0.472414 0.802317 0.534386 0.560105 0.681381 0.366747C0.828377 0.17339 1.04835 0.0447247 1.29292 0.00905743C1.53749 -0.0266099 1.78661 0.0336422 1.98549 0.176559L8.99974 5.2075L16.014 0.17656C16.1125 0.105795 16.2243 0.0545799 16.3431 0.02584C16.462 -0.00289994 16.5855 -0.00860237 16.7066 0.00905829C16.8277 0.0267189 16.944 0.0673968 17.0489 0.128769C17.1538 0.190142 17.2453 0.271007 17.3181 0.366748C17.3909 0.462489 17.4436 0.571231 17.4731 0.686765C17.5027 0.802299 17.5085 0.922362 17.4904 1.0401C17.4722 1.15784 17.4304 1.27094 17.3672 1.37296C17.3041 1.47498 17.221 1.56391 17.1225 1.63467L9.55398 7.06863C9.39344 7.18367 9.19917 7.24557 8.99974 7.24524Z" fill="#7AE229"/>
            <path d="M8.99998 12.0001C8.80055 12.0005 8.60628 11.9386 8.44574 11.8235L0.877242 6.38955C0.678366 6.24664 0.546029 6.03276 0.509344 5.79498C0.472658 5.5572 0.53463 5.31499 0.681625 5.12163C0.828621 4.92827 1.0486 4.79961 1.29317 4.76394C1.53773 4.72827 1.78686 4.78853 1.98574 4.93144L8.99998 9.96239L16.0142 4.93144C16.2131 4.78853 16.4622 4.72827 16.7068 4.76394C16.9514 4.79961 17.1713 4.92827 17.3183 5.12163C17.4653 5.31499 17.5273 5.5572 17.4906 5.79498C17.4539 6.03276 17.3216 6.24664 17.1227 6.38956L9.55423 11.8235C9.39369 11.9386 9.19941 12.0005 8.99998 12.0001Z" fill="#7AE229"/>
        </g>
        <defs>
            <clipPath id="clip0_99462_2611">
            <rect width="17" height="12" fill="white" transform="translate(0.5)"/>
            </clipPath>
        </defs>
    </svg>
    `;
}

function generateUrgentPrioIcon() {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1.8rem" height="1.2rem" viewBox="0 0 18 12" fill="none">
        <g clip-path="url(#clip0_99462_2667)">
            <path d="M9.00026 4.75476C9.19969 4.75443 9.39397 4.81633 9.55451 4.93137L17.123 10.3653C17.2215 10.4361 17.3046 10.525 17.3678 10.627C17.4309 10.7291 17.4727 10.8422 17.4909 10.9599C17.5276 11.1977 17.4656 11.4399 17.3186 11.6333C17.1716 11.8266 16.9516 11.9553 16.7071 11.9909C16.4625 12.0266 16.2134 11.9664 16.0145 11.8234L9.00026 6.7925L1.98602 11.8234C1.88754 11.8942 1.7757 11.9454 1.65687 11.9742C1.53803 12.0029 1.41455 12.0086 1.29345 11.9909C1.17235 11.9733 1.05602 11.9326 0.951088 11.8712C0.846159 11.8099 0.754691 11.729 0.681906 11.6333C0.609122 11.5375 0.556445 11.4288 0.526885 11.3132C0.497325 11.1977 0.491459 11.0776 0.509623 10.9599C0.527789 10.8422 0.569626 10.7291 0.632752 10.627C0.695876 10.525 0.779049 10.4361 0.877524 10.3653L8.44602 4.93137C8.60656 4.81633 8.80083 4.75443 9.00026 4.75476Z" fill="#FF3D00"/>
            <path d="M9.00002 -0.000121266C9.19945 -0.000455511 9.39372 0.0614475 9.55427 0.176482L17.1228 5.61045C17.3216 5.75336 17.454 5.96724 17.4907 6.20502C17.5273 6.4428 17.4654 6.68501 17.3184 6.87837C17.1714 7.07173 16.9514 7.20039 16.7068 7.23606C16.4623 7.27173 16.2131 7.21147 16.0143 7.06856L9.00002 2.03761L1.98577 7.06856C1.78689 7.21147 1.53777 7.27173 1.2932 7.23606C1.04863 7.20039 0.828657 7.07173 0.681662 6.87837C0.534667 6.68501 0.472695 6.4428 0.509379 6.20502C0.546065 5.96723 0.678402 5.75336 0.87728 5.61044L8.44577 0.176482C8.60631 0.0614474 8.80059 -0.000455546 9.00002 -0.000121266Z" fill="#FF3D00"/>
        </g>
        <defs>
            <clipPath id="clip0_99462_2667">
            <rect width="17" height="12" fill="white" transform="translate(17.5 12) rotate(-180)"/>
            </clipPath>
        </defs>
    </svg>
    `;
}

function generateOpenTaskHTML(id, title, description, category, categoryColor, duedate) {
    return `
	<div id="task_open_overlay_frame" class="task-overlay-frame-open" onclick="doNotForward(event)">
			<!-- tesk overlay tag -->
			<div class="category-container-task-open">
				<div class="category-tag-task-open"style="background-color: ${categoryColor};">${category}</div>
				<div class="close-button" onclick="hideTaskOpen('task_open_overlay_frame')">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
						fill="none">
						<mask id="mask0_99379_7049" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0"
							y="0" width="24" height="24">
							<rect width="24" height="24" fill="#D9D9D9" />
						</mask>
						<g mask="url(#mask0_99379_7049)">
							<path
								d="M12 13.4L7.10005 18.3C6.91672 18.4834 6.68338 18.575 6.40005 18.575C6.11672 18.575 5.88338 18.4834 5.70005 18.3C5.51672 18.1167 5.42505 17.8834 5.42505 17.6C5.42505 17.3167 5.51672 17.0834 5.70005 16.9L10.6 12L5.70005 7.10005C5.51672 6.91672 5.42505 6.68338 5.42505 6.40005C5.42505 6.11672 5.51672 5.88338 5.70005 5.70005C5.88338 5.51672 6.11672 5.42505 6.40005 5.42505C6.68338 5.42505 6.91672 5.51672 7.10005 5.70005L12 10.6L16.9 5.70005C17.0834 5.51672 17.3167 5.42505 17.6 5.42505C17.8834 5.42505 18.1167 5.51672 18.3 5.70005C18.4834 5.88338 18.575 6.11672 18.575 6.40005C18.575 6.68338 18.4834 6.91672 18.3 7.10005L13.4 12L18.3 16.9C18.4834 17.0834 18.575 17.3167 18.575 17.6C18.575 17.8834 18.4834 18.1167 18.3 18.3C18.1167 18.4834 17.8834 18.575 17.6 18.575C17.3167 18.575 17.0834 18.4834 16.9 18.3L12 13.4Z"
								fill="#2A3647" />
						</g>
					</svg>
				</div>

			</div>
			<!-- task overlay title -->
			<div class="title-task-overlay-open">${title}</div>
			<!-- task overlay description -->
			<div class="desc-task-open">${description}</div>
			<!-- task overlay duedate -->
			<div class="subheader-task-open">
				<div class="label-task-open">Due date:</div>
				<div>${duedate}</div>
			</div>
			<!-- task overlay prio -->

			<div class="subheader-task-open">
				<div class="label-task-open">Priority:</div>
				<div id="task_open_prio" class="prio-container-style-task-open">
				</div>
			</div>

			<!-- task overlay assigned to -->
			<div class="column-frame-container-task-open">
				<div class="label-task-open">Assigned To:</div>
				<div id="assigned_to_contacts_task_open">

				</div>
			</div>

			<!-- task overlay subtasks-->
			<div class="column-frame-container-task-open">
				<div id="label_task_open_subtask" class="label-task-open">Subtasks</div>
				<div id="task_overlay_subtasks_container">
					<!-- substasks -->

				</div>
			</div>
			<div class="delete-edit-container-task-open">
				<div id="delete_btn_task_open" class="del-ed-btn-task-open" onclick="deleteTask(${id})">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
						fill="none">
						<mask id="mask0_99408_2217" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0"
							y="0" width="24" height="24">
							<rect width="24" height="24" fill="#D9D9D9" />
						</mask>
						<g mask="url(#mask0_99408_2217)">
							<path
								d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z"
								fill="#2A3647" />
						</g>
					</svg>
					<div>Delete</div>
				</div>
				<svg xmlns="http://www.w3.org/2000/svg" width="2" height="24" viewBox="0 0 2 24"
					fill="none">
					<path d="M1 0V24" stroke="#D1D1D1" />
				</svg>
				<div id="edit_btn_task_open" class="del-ed-btn-task-open" onclick="loadTaskEdit(${id})">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
						fill="none">
						<mask id="mask0_99408_2223" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0"
							y="0" width="24" height="24">
							<rect width="24" height="24" fill="#D9D9D9" />
						</mask>
						<g mask="url(#mask0_99408_2223)">
							<path
								d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z"
								fill="#2A3647" />
						</g>
					</svg>
					<div>Edit</div>
				</div>
			</div>

		</div>
	</div>
    `;
}

function generateAssigmentHTML(userBadge, badgeColor, assignedUserName, id) {
    return `
        <div class="assigned-to-contact-task-open">
            <div id="contect_badge${id}" class="contact-badge-task-open"
                style="background-color: ${badgeColor};">${userBadge}</div>
            <div class="contact-name-task-open">${assignedUserName}</div>
        </div>

    `;
}

function generateEditTaskAssigmentContactsHTML(badgeColor, userBadge, assignedUserName, i, ID) {
    return `
    <label class="slider-contact-label">
        <div class="current-contact-slider">
            <div id="contect_badge${i}" class="contact-badge"
                style="background-color: ${badgeColor};">
                <span>${userBadge}</span>
            </div>
            <span>${assignedUserName} </span>
            <div class="log-in-checkbox">
                <input onclick="addContactAsAssigned('${ID}_confirm_contact${i}', ${i}, ${ID})" id="${ID}_confirm_contact${i}" type="checkbox" />
                <label class="checkbox-edit-task" for="${ID}_confirm_contact${i}"></label>
            </div>
        </div>
    </label>
    `;
}

function generateEditTaskAssigmentContactsCheckedHTML(badgeColor, userBadge, assignedUserName, i, ID) {
    return `
    <label class="slider-contact-label">
        <div class="current-contact-slider">
            <div id="contect_badge${i}" class="contact-badge"
                style="background-color: ${badgeColor};">
                <span>${userBadge}</span>
            </div>
            <span>${assignedUserName} </span>
            <div class="log-in-checkbox">
                <input onclick="addContactAsAssigned('${ID}_confirm_contact${i}', ${i}, ${ID})" id="${ID}_confirm_contact${i}" type="checkbox" checked/>
                <label class="checkbox-edit-task" for="${ID}_confirm_contact${i}"></label>
            </div>
        </div>
    </label>
    `;
}

function generateSubtasksHTML(subtitle, i, ID) {
    return `
    <div class="log-in-checkbox">
        <input onclick="changeSubtaskConfirmation('${ID}_confirm_subtask${i}', ${i}, ${ID})" id="${ID}_confirm_subtask${i}" type="checkbox" />
        <label class="checkbox-hover" for="${ID}_confirm_subtask${i}">${subtitle}</label>
    </div>
    `;
}

function generateSubtasksCheckedHTML(subtitle, i, ID) {
    return `
    <div class="log-in-checkbox">
        <input onclick="changeSubtaskConfirmation('${ID}_confirm_subtask${i}', ${i}, ${ID})" id="${ID}_confirm_subtask${i}" type="checkbox" checked/>
        <label class="checkbox-hover" for="${ID}_confirm_subtask${i}">${subtitle}</label>
    </div>
    `;
}

function generateSubtaskListItemHTML(subtitle, i, ID, subtaskListItemID, subtaskEditContainerID, subtaskEditInputID, subtaskList) {
    let subtaskListItem = `${ID}${subtaskListItemID}${i}`;
    let subtaskEditContainer = `${ID}${subtaskEditContainerID}${i}`;
    let subtaskEditInput = `${ID}${subtaskEditInputID}${i}`;

    return `
        <!-- Subtask List Item -->
        <div id="${subtaskListItem}" class="subtask-list-item-slider">
            <ul>
                <li>${subtitle}</li>
            </ul>
            <div class="subtask-icon-container">
                <img src="./assets/img/edit-subtask.svg" alt="Edit Subtask" onclick="showSubtaskEditInputFrame('${subtaskListItem}', '${subtaskEditContainer}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="2" height="24"
                    viewBox="0 0 2 24" fill="none">
                    <path d="M1.14453 0V24" stroke="#A8A8A8" />
                </svg>
                <img src="./assets/img/delete-icon.svg" alt="Delete Subtask" onclick="deleteSubtask(${ID}, ${i}, '${subtaskList}')">
            </div>
        </div>

        <!-- Subtask Edit List Item -->

        <div id="${subtaskEditContainer}" class="subtask-edit-input-container d-none">
            <input id="${subtaskEditInput}" class="subtask-edit-input" type="text"
                value="${subtitle}">
            <div class="subtask-edit-container">
                <img class="subtask-button-slider" src="./assets/img/delete-icon.svg"
                    alt="delete subtask" onclick="deleteSubtask(${ID}, ${i}, '${subtaskList}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="2" height="24"
                    viewBox="0 0 2 24" fill="none">
                    <path d="M1.14453 0V24" stroke="#A8A8A8" />
                </svg>
                <img class="subtask-button-slider" src="./assets/img/add-check-icon.svg"
                    alt="check subtask" onclick="updateSubtask(${ID}, '${subtaskListItem}', '${subtaskEditInput}', ${i}, '${subtaskEditContainer}', '${subtaskList}')">
            </div>
        </div>
    `;
}

function generateEditTaskHTML(id, title, description, duedate) {
    return `
            <div id="task_open_overlay_frame" class="task-overlay-frame-open" onclick="doNotForward(event)">
                <!-- tesk overlay close Button -->
                <div class="close-btn-container-task-edit">
                    <div class="close-button" onclick="loadAddedTasksFromStorage(), hideTaskOpen('task_open_overlay_frame')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="none">
                            <mask id="mask0_99379_7049" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0"
                                y="0" width="24" height="24">
                                <rect width="24" height="24" fill="#D9D9D9" />
                            </mask>
                            <g mask="url(#mask0_99379_7049)">
                                <path
                                    d="M12 13.4L7.10005 18.3C6.91672 18.4834 6.68338 18.575 6.40005 18.575C6.11672 18.575 5.88338 18.4834 5.70005 18.3C5.51672 18.1167 5.42505 17.8834 5.42505 17.6C5.42505 17.3167 5.51672 17.0834 5.70005 16.9L10.6 12L5.70005 7.10005C5.51672 6.91672 5.42505 6.68338 5.42505 6.40005C5.42505 6.11672 5.51672 5.88338 5.70005 5.70005C5.88338 5.51672 6.11672 5.42505 6.40005 5.42505C6.68338 5.42505 6.91672 5.51672 7.10005 5.70005L12 10.6L16.9 5.70005C17.0834 5.51672 17.3167 5.42505 17.6 5.42505C17.8834 5.42505 18.1167 5.51672 18.3 5.70005C18.4834 5.88338 18.575 6.11672 18.575 6.40005C18.575 6.68338 18.4834 6.91672 18.3 7.10005L13.4 12L18.3 16.9C18.4834 17.0834 18.575 17.3167 18.575 17.6C18.575 17.8834 18.4834 18.1167 18.3 18.3C18.1167 18.4834 17.8834 18.575 17.6 18.575C17.3167 18.575 17.0834 18.4834 16.9 18.3L12 13.4Z"
                                    fill="#2A3647" />
                            </g>
                        </svg>
                    </div>
                </div>
                <div class="overlay-scroll">
                    <!-- Title Edit Task-->
                    <div class="subhead-container-ed-task">
                        <div class="subhead-ed-task">Title</div>

                        <input required="" placeholder="Enter a title" id="title_input_ed_task"
                            class="input-frame-ed-task" type="text" autocomplete="off" value="${title}">
                        <div class="error-message-slider" id="title_error_slider"></div>
                    </div>
                    <!-- Descrption Edit Task  -->
                    <div class="subhead-container-ed-task">
                        <div class="subhead-ed-task">Description</div>
                        <textarea required="" placeholder="Enter a Description" name="" id="description_ed_task"
                            class="description-textarea" cols="50" rows="10">${description}</textarea>
                        <div></div>
                    </div>

                    <!-- Calender Edit Task -->
                    <div class="date-container-slider">
                        <div class="subhead-ed-task">Due date</div>
                        <input type="date" id="calendar_edit_task" value="${duedate}">
                        <div class="error-message-slider" id="date_error_slider"></div>
                    </div>

                    <!--Prio Edit Task  -->
                    <div class="subhead-container-ed-task">
                        <div class="subhead-ed-task">Prio</div>

                        <div class="prio-buttons-container">
                            <button value="Urgent" onclick="changePrioBtnColor('urgent-btn', true)"
                                type="button" id="urgent-btn">Urgent

                                <svg xmlns="http://www.w3.org/2000/svg" width="2.1rem" height="1.6rem"
                                    viewBox="0 0 21 16" fill="none">
                                    <g clip-path="url(#clip0_99234_5027)">
                                        <path id='urgent-btn-svg1'
                                            d="M19.6527 15.2547C19.418 15.2551 19.1895 15.1803 19.0006 15.0412L10.7486 8.958L2.4965 15.0412C2.38065 15.1267 2.24907 15.1887 2.10927 15.2234C1.96947 15.2582 1.82419 15.2651 1.68172 15.2437C1.53925 15.2223 1.40239 15.1732 1.27894 15.099C1.1555 15.0247 1.04789 14.927 0.962258 14.8112C0.876629 14.6954 0.814657 14.5639 0.77988 14.4243C0.745104 14.2846 0.738203 14.1394 0.759574 13.997C0.802733 13.7095 0.958423 13.4509 1.19239 13.2781L10.0965 6.70761C10.2852 6.56802 10.5138 6.49268 10.7486 6.49268C10.9833 6.49268 11.2119 6.56802 11.4006 6.70761L20.3047 13.2781C20.4906 13.415 20.6285 13.6071 20.6987 13.827C20.7688 14.0469 20.7677 14.2833 20.6954 14.5025C20.6231 14.7216 20.4833 14.9124 20.296 15.0475C20.1088 15.1826 19.8836 15.2551 19.6527 15.2547Z"
                                            fill="#FF3D00" />
                                        <path id='urgent-btn-svg2'
                                            d="M19.6527 9.50568C19.4181 9.50609 19.1895 9.43124 19.0006 9.29214L10.7486 3.20898L2.49654 9.29214C2.26257 9.46495 1.96948 9.5378 1.68175 9.49468C1.39403 9.45155 1.13523 9.29597 0.962293 9.06218C0.789357 8.82838 0.71645 8.53551 0.759609 8.24799C0.802768 7.96048 0.958458 7.70187 1.19243 7.52906L10.0965 0.958588C10.2852 0.818997 10.5138 0.743652 10.7486 0.743652C10.9834 0.743652 11.212 0.818997 11.4007 0.958588L20.3048 7.52906C20.4907 7.66598 20.6286 7.85809 20.6987 8.07797C20.7689 8.29785 20.7677 8.53426 20.6954 8.75344C20.6231 8.97262 20.4833 9.16338 20.2961 9.29847C20.1088 9.43356 19.8837 9.50608 19.6527 9.50568Z"
                                            fill="#FF3D00" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_99234_5027">
                                            <rect width="20" height="14.5098" fill="white"
                                                transform="translate(0.748535 0.745117)" />
                                        </clipPath>
                                    </defs>
                                </svg>

                            </button>
                            <button value="Medium" onclick="changePrioBtnColor('medium-btn', true)"
                                type="button" id="medium-btn">Medium
                                <svg xmlns="http://www.w3.org/2000/svg" width="2.1rem" height="0.8rem" viewBox="0 0 21 8"
                                    fill="none">
                                    <g clip-path="url(#clip0_99234_5034)">
                                        <path id='medium-btn-svg1'
                                            d="M19.1526 7.72528H1.34443C1.05378 7.72528 0.775033 7.60898 0.569514 7.40197C0.363995 7.19495 0.248535 6.91419 0.248535 6.62143C0.248535 6.32867 0.363995 6.0479 0.569514 5.84089C0.775033 5.63388 1.05378 5.51758 1.34443 5.51758H19.1526C19.4433 5.51758 19.722 5.63388 19.9276 5.84089C20.1331 6.0479 20.2485 6.32867 20.2485 6.62143C20.2485 6.91419 20.1331 7.19495 19.9276 7.40197C19.722 7.60898 19.4433 7.72528 19.1526 7.72528Z"
                                            fill="#FFA800" />
                                        <path id='medium-btn-svg2'
                                            d="M19.1526 2.48211H1.34443C1.05378 2.48211 0.775033 2.36581 0.569514 2.1588C0.363995 1.95179 0.248535 1.67102 0.248535 1.37826C0.248535 1.0855 0.363995 0.804736 0.569514 0.597724C0.775033 0.390712 1.05378 0.274414 1.34443 0.274414L19.1526 0.274414C19.4433 0.274414 19.722 0.390712 19.9276 0.597724C20.1331 0.804736 20.2485 1.0855 20.2485 1.37826C20.2485 1.67102 20.1331 1.95179 19.9276 2.1588C19.722 2.36581 19.4433 2.48211 19.1526 2.48211Z"
                                            fill="#FFA800" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_99234_5034">
                                            <rect width="20" height="7.45098" fill="white"
                                                transform="translate(0.248535 0.274414)" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </button>
                            <button value="Low" onclick="changePrioBtnColor('low-btn', true)" type="button"
                                id="low-btn">Low
                                <svg xmlns="http://www.w3.org/2000/svg" width="2.1rem" height="1.6rem"
                                    viewBox="0 0 21 16" fill="none">
                                    <path id='low-btn-svg1'
                                        d="M10.2485 9.50614C10.0139 9.50654 9.7854 9.4317 9.59655 9.29262L0.693448 2.72288C0.57761 2.63733 0.47977 2.52981 0.405515 2.40647C0.33126 2.28313 0.282043 2.14638 0.260675 2.00404C0.217521 1.71655 0.290421 1.42372 0.463337 1.18994C0.636253 0.956173 0.895022 0.800615 1.18272 0.757493C1.47041 0.71437 1.76347 0.787216 1.99741 0.960004L10.2485 7.04248L18.4997 0.960004C18.6155 0.874448 18.7471 0.812529 18.8869 0.777782C19.0266 0.743035 19.1719 0.736141 19.3144 0.757493C19.4568 0.778844 19.5937 0.828025 19.7171 0.902225C19.8405 0.976425 19.9481 1.07419 20.0337 1.18994C20.1194 1.3057 20.1813 1.43717 20.2161 1.57685C20.2509 1.71653 20.2578 1.86169 20.2364 2.00404C20.215 2.14638 20.1658 2.28313 20.0916 2.40647C20.0173 2.52981 19.9195 2.63733 19.8036 2.72288L10.9005 9.29262C10.7117 9.4317 10.4831 9.50654 10.2485 9.50614Z"
                                        fill="#7AE229" />
                                    <path id='low-btn-svg2'
                                        d="M10.2485 15.2547C10.0139 15.2551 9.7854 15.1802 9.59655 15.0412L0.693448 8.47142C0.459502 8.29863 0.30383 8.04005 0.260675 7.75257C0.217521 7.46509 0.290421 7.17225 0.463337 6.93848C0.636253 6.70471 0.895021 6.54915 1.18272 6.50603C1.47041 6.46291 1.76347 6.53575 1.99741 6.70854L10.2485 12.791L18.4997 6.70854C18.7336 6.53575 19.0267 6.46291 19.3144 6.50603C19.602 6.54915 19.8608 6.70471 20.0337 6.93848C20.2066 7.17225 20.2795 7.46509 20.2364 7.75257C20.1932 8.04005 20.0376 8.29863 19.8036 8.47142L10.9005 15.0412C10.7117 15.1802 10.4831 15.2551 10.2485 15.2547Z"
                                        fill="#7AE229" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <!-- Assigned To Edit Task -->
                    <div class="subhead-container-ed-task">
                        <div class="subhead-ed-task">Assigned to</div>
                        <div class="assigned-to-input-slider">
                            <input id="et_select_contacts_search" class="assigned-to-slider" type="text "
                                placeholder="Select contacts to assign" autocomplete="off" onkeyup="filterUserOnAssignedTo('et_select_contacts_search', 'et_contact_overlay', ${id})">
                            <img id="select-contacts_down" class="select-contacts-dropdown" src="./assets/img/arrow_drop_down.svg"
                            alt="Select Contacts Button" onclick="openContactOverlay('et_contact_overlay','et_selected_contacts')">
                            <img id="select-contacts_up" class="select-contacts-dropdown d-none" src="./assets/img/arrow_drop_up.svg"
                            alt="Select Contacts Button" onclick="openContactOverlay('et_contact_overlay', 'et_selected_contacts')">

                        </div>
                        <div class="p-relative">
                            <div class="contact-overlay d-none" id="et_contact_overlay">
                                <!-- Contact for render -->

                            </div>
                            <div id="et_selected_contacts" class="selected-contacts">
                                <!-- select contact -->

                            </div>
                        </div>
                    </div>

                    <!-- Subtask Edit Task -->
                    <div id="subtask_container_slider" class="subtask-container-slider">
                        <div class="subhead-ed-task">Subtasks</div>
                        <div class="subtask-input-container">
                            <input id="subtask_input" class="subtask-input-slider" type="text" placeholder="Add new subtask">
                            <img id="add_subtask" class="add-subtask-slider" src="./assets/img/add-plus-icon.svg"
                                alt="Add Subtasks" onclick="showSubtaskInput('add_subtask', 'check_subtask_icons')">

                            <div id="check_subtask_icons" class="check-subtask-icons d-none">
                                <img class="subtask-button-slider" src="./assets/img/add-cancel-icon.svg"
                                    alt="Cancel Subtask" onclick="cancelAddSubtask('add_subtask', 'check_subtask_icons')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="2" height="24" viewBox="0 0 2 24"
                                    fill="none">
                                    <path d="M1.14453 0V24" stroke="#D1D1D1" />
                                </svg>
                                <img class="subtask-button-slider" src="./assets/img/add-check-icon.svg"
                                    alt="Check Substask" onclick="addSubtask(${id}, 'subtask_lists')">

                            </div>
                        </div>

                        <div id="subtask_lists">


                        </div>
                    </div>

                </div>
                <div class="delete-edit-container-task-open">
                    <button type="submit" class="ok-ed-task-btn" id="ok_ed-task-btn" onclick="updateOpenTask(${id})">
                        <span>Ok</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24"
                            fill="none">
                            <mask id="mask0_71766_6017" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0"
                                y="0" width="25" height="24">
                                <rect x="0.0683594" width="24" height="24" fill="#D9D9D9" />
                            </mask>
                            <g mask="url(#mask0_71766_6017)">
                                <path
                                    d="M9.61905 15.15L18.0941 6.675C18.2941 6.475 18.5316 6.375 18.8066 6.375C19.0816 6.375 19.3191 6.475 19.5191 6.675C19.7191 6.875 19.8191 7.1125 19.8191 7.3875C19.8191 7.6625 19.7191 7.9 19.5191 8.1L10.3191 17.3C10.1191 17.5 9.88572 17.6 9.61905 17.6C9.35239 17.6 9.11905 17.5 8.91905 17.3L4.61905 13C4.41905 12.8 4.32322 12.5625 4.33155 12.2875C4.33989 12.0125 4.44405 11.775 4.64405 11.575C4.84405 11.375 5.08155 11.275 5.35655 11.275C5.63155 11.275 5.86905 11.375 6.06905 11.575L9.61905 15.15Z"
                                    fill="white" />
                            </g>
                        </svg>
                    </button>
                </div>
            </div>

    `;
}