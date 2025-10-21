MAKEFLAGS += --no-print-directory

VERSION ?= latest
NAMESPACE ?= datamate

.PHONY: build-%
build-%:
	$(MAKE) $*-docker-build

.PHONY: build
build: backend-docker-build frontend-docker-build runtime-docker-build

.PHONY: create-namespace
create-namespace:
	@kubectl get namespace $(NAMESPACE) > /dev/null 2>&1 || kubectl create namespace $(NAMESPACE)

.PHONY: install-%
install-%:
ifeq ($(origin INSTALLER), undefined)
	@echo "Choose a deployment method:"
	@echo "1. Docker"
	@echo "2. Kubernetes/Helm"
	@echo -n "Enter choice: "
	@read choice; \
	case $$choice in \
		1) INSTALLER=docker ;; \
		2) INSTALLER=k8s ;; \
		*) echo "Invalid choice" && exit 1 ;; \
	esac; \
	$(MAKE) $*-$$INSTALLER-install
else
	$(MAKE) $*-$(INSTALLER)-install
endif

.PHONY: install
install: install-data-mate

.PHONY: uninstall-%
uninstall-%:
ifeq ($(origin INSTALLER), undefined)
	@echo "Choose a deployment method:"
	@echo "1. Docker"
	@echo "2. Kubernetes/Helm"
	@echo -n "Enter choice: "
	@read choice; \
	case $$choice in \
		1) INSTALLER=docker ;; \
		2) INSTALLER=k8s ;; \
		*) echo "Invalid choice" && exit 1 ;; \
	esac; \
    $(MAKE) $*-$$INSTALLER-uninstall
else
	$(MAKE) $*-$(INSTALLER)-uninstall
endif

.PHONY: uninstall
uninstall: uninstall-data-mate

# build
.PHONY: mineru-docker-build
mineru-docker-build:
	docker build -t mineru:$(VERSION) . -f scripts/images/mineru/Dockerfile

.PHONY: datax-docker-build
datax-docker-build:
	docker build -t datax:$(VERSION) . -f scripts/images/datax/Dockerfile

.PHONY: unstructured-docker-build
unstructured-docker-build:
	docker build -t unstructured:$(VERSION) . -f scripts/images/unstructured/Dockerfile

.PHONY: backend-docker-build
backend-docker-build:
	docker build -t backend:$(VERSION) . -f scripts/images/backend/Dockerfile

.PHONY: frontend-docker-build
frontend-docker-build:
	docker build -t frontend:$(VERSION) . -f scripts/images/frontend/Dockerfile

.PHONY: runtime-docker-build
runtime-docker-build:
	docker build -t runtime:$(VERSION) . -f scripts/images/runtime/Dockerfile

.PHONY: backend-docker-install
backend-docker-install:
	cd deployment/docker/data-mate && docker-compose up -d backend

.PHONY: backend-docker-uninstall
backend-docker-uninstall:
	cd deployment/docker/data-mate && docker-compose down backend

.PHONY: frontend-docker-install
frontend-docker-install:
	cd deployment/docker/data-mate && docker-compose up -d frontend

.PHONY: frontend-docker-uninstall
frontend-docker-uninstall:
	cd deployment/docker/data-mate && docker-compose down frontend

.PHONY: runtime-docker-install
runtime-docker-install:
	cd deployment/docker/data-mate && docker-compose up -d runtime

.PHONY: runtime-docker-uninstall
runtime-docker-uninstall:
	cd deployment/docker/data-mate && docker-compose down runtime

.PHONY: runtime-k8s-install
runtime-k8s-install: create-namespace
	helm upgrade kuberay-operator deployment/helm/ray/kuberay-operator --install -n $(NAMESPACE)
	helm upgrade raycluster deployment/helm/ray/ray-cluster/ --install -n $(NAMESPACE)
	kubectl apply -f deployment/helm/ray/service.yaml -n $(NAMESPACE)

.PHONY: runtime-k8s-uninstall
runtime-k8s-uninstall:
	helm uninstall raycluster -n $(NAMESPACE)
	helm uninstall kuberay-operator -n $(NAMESPACE)
	kubectl delete -f deployment/helm/ray/service.yaml -n $(NAMESPACE)

.PHONY: unstructured-k8s-install
unstructured-k8s-install: create-namespace
	kubectl apply -f deployment/kubernetes/unstructured/deploy.yaml -n $(NAMESPACE)

.PHONY: mysql-k8s-install
mysql-k8s-install: create-namespace
	kubectl create configmap init-sql --from-file=scripts/db/ --dry-run=client -o yaml | kubectl apply -f - -n $(NAMESPACE)
	kubectl apply -f deployment/kubernetes/mysql/configmap.yaml -n $(NAMESPACE)
	kubectl apply -f deployment/kubernetes/mysql/deploy.yaml -n $(NAMESPACE)

.PHONY: mysql-k8s-uninstall
mysql-k8s-uninstall:
	kubectl delete configmap init-sql -n $(NAMESPACE)
	kubectl delete -f deployment/kubernetes/mysql/configmap.yaml -n $(NAMESPACE)
	kubectl delete -f deployment/kubernetes/mysql/deploy.yaml -n $(NAMESPACE)

.PHONY: backend-k8s-install
backend-k8s-install: create-namespace
	kubectl apply -f deployment/kubernetes/backend/deploy.yaml -n $(NAMESPACE)

.PHONY: backend-k8s-uninstall
backend-k8s-uninstall:
	kubectl delete -f deployment/kubernetes/backend/deploy.yaml -n $(NAMESPACE)

.PHONY: frontend-k8s-install
frontend-k8s-install: create-namespace
	kubectl apply -f deployment/kubernetes/frontend/deploy.yaml -n $(NAMESPACE)

.PHONY: frontend-k8s-uninstall
frontend-k8s-uninstall:
	kubectl delete -f deployment/kubernetes/frontend/deploy.yaml -n $(NAMESPACE)

.PHONY: data-mate-docker-install
data-mate-docker-install:
	cd deployment/docker/datamate && docker-compose up -d

.PHONY: data-mate-docker-uninstall
data-mate-docker-uninstall:
	cd deployment/docker/datamate && docker-compose down

.PHONY: data-mate-k8s-install
data-mate-k8s-install: create-namespace mysql-k8s-install backend-k8s-install frontend-k8s-install runtime-k8s-install

.PHONY: data-mate-k8s-uninstall
data-mate-k8s-uninstall: mysql-k8s-uninstall backend-k8s-uninstall frontend-k8s-uninstall runtime-k8s-uninstall
