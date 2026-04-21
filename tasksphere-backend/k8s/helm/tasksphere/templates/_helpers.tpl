{{/*
Expand the name of the chart.
*/}}
{{- define "tasksphere.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "tasksphere.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "tasksphere.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "tasksphere.labels" -}}
helm.sh/chart: {{ include "tasksphere.chart" . }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/part-of: tasksphere
{{- end }}

{{/*
Service labels — accepts a dict with Root (global context) and Name (service name)
*/}}
{{- define "tasksphere.serviceLabels" -}}
app.kubernetes.io/name: {{ .Name }}
app.kubernetes.io/instance: {{ .Name }}
{{ include "tasksphere.labels" .Root }}
{{- end }}

{{/*
Selector labels for a given service name
*/}}
{{- define "tasksphere.selectorLabels" -}}
app.kubernetes.io/name: {{ .Name }}
app.kubernetes.io/instance: {{ .Name }}
{{- end }}

{{/*
Namespace helper
*/}}
{{- define "tasksphere.namespace" -}}
{{- default "tasksphere" .Values.global.namespace }}
{{- end }}
